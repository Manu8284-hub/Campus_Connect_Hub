import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser } from '../../controllers/authController.js';
import User from '../../models/User.js';
import LoginHistory from '../../models/LoginHistory.js';
import { isMongoReady } from '../../config/db.js';
import { getNextId } from '../../utils/helpers.js';
import { generateToken } from '../../utils/jwt.js';

// Mock the dependencies
vi.mock('../../models/User.js');
vi.mock('../../models/LoginHistory.js');
vi.mock('../../config/db.js', () => ({
  isMongoReady: vi.fn(),
}));
vi.mock('../../utils/helpers.js', () => ({
  getNextId: vi.fn(),
  loadLocalDb: vi.fn(),
  saveLocalDb: vi.fn(),
  getNextLocalId: vi.fn(),
  removeMongooseMetadata: vi.fn(val => val),
}));
vi.mock('../../utils/jwt.js', () => ({
  generateToken: vi.fn(),
  clearToken: vi.fn(),
}));
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    genSalt: vi.fn(),
    hash: vi.fn(),
  },
}));

describe('authController - loginUser', () => {
  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should return 401 for invalid credentials when mongo is ready', async () => {
    req.body = { email: 'test@example.com', password: 'wrongpassword', provider: 'credentials' };
    isMongoReady.mockReturnValue(true);
    
    // Mock User.findOne to return null (user not found)
    User.findOne = vi.fn().mockResolvedValue(null);

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should login successfully for valid credentials when mongo is ready', async () => {
    req.body = { email: 'test@example.com', password: 'correctpassword', provider: 'credentials' };
    isMongoReady.mockReturnValue(true);

    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      matchPassword: vi.fn().mockResolvedValue(true),
    };

    User.findOne = vi.fn().mockResolvedValue(mockUser);
    getNextId.mockResolvedValue(100);
    LoginHistory.prototype.save = vi.fn().mockResolvedValue(true);

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockUser.matchPassword).toHaveBeenCalledWith('correctpassword');
    expect(generateToken).toHaveBeenCalledWith(res, mockUser.id);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: {
        name: 'Test User',
        email: 'test@example.com',
        id: 1,
        joinedClubIds: [],
        eventRegistrations: [],
        picture: ""
      },
    });
  });

  it('should trigger emergency fallback for admin user', async () => {
    req.body = { email: 'admin@gmail.com', password: 'admin@123', provider: 'credentials' };
    isMongoReady.mockReturnValue(true);
    
    // Mock User.findOne to return the admin user
    const mockAdminUser = {
      id: 9999,
      name: 'Admin User',
      email: 'admin@gmail.com'
    };
    User.findOne = vi.fn().mockResolvedValue(mockAdminUser);

    await loginUser(req, res);

    expect(generateToken).toHaveBeenCalledWith(res, mockAdminUser.id);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful (Admin)',
      user: {
        name: 'Admin User',
        email: 'admin@gmail.com',
        id: 9999,
        joinedClubIds: [],
        eventRegistrations: [],
        picture: ""
      },
    });
  });
});
