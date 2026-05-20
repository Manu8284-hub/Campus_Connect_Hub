import { describe, it, expect, vi } from 'vitest';
import { generateToken, clearToken } from './jwt.js';

describe('JWT Utils', () => {
  it('should generate a token and set it in a cookie', () => {
    const res = {
      cookie: vi.fn(),
    };
    
    const userId = 123;
    const token = generateToken(res, userId);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(res.cookie).toHaveBeenCalledWith(
      'jwt',
      token,
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
      })
    );
  });

  it('should clear the token by setting an empty cookie with an expired date', () => {
    const res = {
      cookie: vi.fn(),
    };
    
    clearToken(res);

    expect(res.cookie).toHaveBeenCalledWith(
      'jwt',
      '',
      expect.objectContaining({
        httpOnly: true,
        expires: expect.any(Date),
      })
    );
    
    const callArgs = res.cookie.mock.calls[0];
    expect(callArgs[2].expires.getTime()).toBe(0);
  });
});
