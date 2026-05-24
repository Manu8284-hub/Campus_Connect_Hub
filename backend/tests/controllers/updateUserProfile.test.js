import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateUserProfile } from '../../controllers/authController.js';
import User from '../../models/User.js';
import { isMongoReady } from '../../config/db.js';
import { loadLocalDb, saveLocalDb } from '../../utils/helpers.js';

// Mock dependencies
vi.mock('../../models/User.js');
vi.mock('../../config/db.js', () => ({
  isMongoReady: vi.fn(),
}));
vi.mock('../../utils/helpers.js', () => ({
  loadLocalDb: vi.fn(),
  saveLocalDb: vi.fn(),
  removeMongooseMetadata: vi.fn(val => val),
}));

describe('authController - updateUserProfile', () => {
  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      params: { email: 'user@example.com' },
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  describe('when MongoDB is ready', () => {
    beforeEach(() => {
      isMongoReady.mockReturnValue(true);
    });

    it('should update name, bio, and other profile details successfully', async () => {
      req.body = {
        displayName: 'New Name',
        bio: 'New Bio',
        interests: ['Coding'],
      };

      const mockUpdatedUser = {
        id: 1,
        name: 'New Name',
        email: 'user@example.com',
        bio: 'New Bio',
        interests: ['Coding'],
      };

      User.findOne = vi.fn().mockResolvedValue(null); // No email conflict
      User.findOneAndUpdate = vi.fn().mockResolvedValue(mockUpdatedUser);

      await updateUserProfile(req, res);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'user@example.com' },
        { $set: { displayName: 'New Name', name: 'New Name', bio: 'New Bio', interests: ['Coding'] } },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({ profile: mockUpdatedUser });
    });

    it('should fail if the target email is already taken by another user', async () => {
      req.body = {
        email: 'taken@example.com',
        displayName: 'New Name',
      };

      // Mock finding another user with the target email
      User.findOne = vi.fn().mockResolvedValue({ id: 2, email: 'taken@example.com' });

      await updateUserProfile(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'taken@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email is already in use by another account' });
    });
  });

  describe('when MongoDB is NOT ready (Local DB fallback)', () => {
    beforeEach(() => {
      isMongoReady.mockReturnValue(false);
    });

    it('should update local DB successfully', async () => {
      req.body = {
        displayName: 'New Name',
        bio: 'New Bio',
        interests: ['Coding'],
      };

      const mockDb = {
        users: [
          { id: 1, name: 'Old Name', email: 'user@example.com', bio: 'Old Bio' },
          { id: 2, name: 'Other User', email: 'other@example.com' },
        ],
      };

      loadLocalDb.mockResolvedValue(mockDb);

      await updateUserProfile(req, res);

      expect(saveLocalDb).toHaveBeenCalled();
      expect(mockDb.users[0].name).toBe('New Name');
      expect(mockDb.users[0].bio).toBe('New Bio');
      expect(mockDb.users[0].interests).toEqual(['Coding']);
      expect(res.json).toHaveBeenCalledWith({
        profile: { id: 1, name: 'New Name', displayName: 'New Name', email: 'user@example.com', bio: 'New Bio', interests: ['Coding'] },
      });
    });

    it('should fail in local DB if target email is taken', async () => {
      req.body = {
        email: 'other@example.com',
        displayName: 'New Name',
      };

      const mockDb = {
        users: [
          { id: 1, name: 'Old Name', email: 'user@example.com' },
          { id: 2, name: 'Other User', email: 'other@example.com' },
        ],
      };

      loadLocalDb.mockResolvedValue(mockDb);

      await updateUserProfile(req, res);

      expect(saveLocalDb).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email is already in use by another account' });
    });
  });
});
