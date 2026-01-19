import {
  getMockUsers,
  getMockUserById,
  getMockPosts,
  getMockPostById,
  addMockPost,
  addMockComment,
  updateMockUserPlan
} from '../mock-data'
import type { UserProfile, Post, Comment, Plan } from '@/types'

describe('Mock Data Functions', () => {
  describe('getMockUsers', () => {
    it('should return an array of users', () => {
      const users = getMockUsers()
      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBeGreaterThan(0)
    })

    it('should return users with required properties', () => {
      const users = getMockUsers()
      const user = users[0]
      
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('plan')
      expect(user).toHaveProperty('aiResponsesToday')
      expect(user).toHaveProperty('aiResponsesThisWeek')
      expect(user).toHaveProperty('lastLogin')
      expect(user).toHaveProperty('recentActivities')
    })

    it('should return a deep copy of users', () => {
      const users1 = getMockUsers()
      const users2 = getMockUsers()
      
      expect(users1).not.toBe(users2) // Different object references
      expect(users1[0]).not.toBe(users2[0]) // Different user object references
    })
  })

  describe('getMockUserById', () => {
    it('should return user when found', () => {
      const user = getMockUserById('user1')
      expect(user).toBeDefined()
      expect(user?.id).toBe('user1')
    })

    it('should return undefined when user not found', () => {
      const user = getMockUserById('nonexistent')
      expect(user).toBeUndefined()
    })

    it('should return a deep copy of the user', () => {
      const user1 = getMockUserById('user1')
      const user2 = getMockUserById('user1')
      
      expect(user1).not.toBe(user2) // Different object references
    })
  })

  describe('getMockPosts', () => {
    it('should return an array of posts', () => {
      const posts = getMockPosts()
      expect(Array.isArray(posts)).toBe(true)
      expect(posts.length).toBeGreaterThan(0)
    })

    it('should return posts with required properties', () => {
      const posts = getMockPosts()
      const post = posts[0]
      
      expect(post).toHaveProperty('id')
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('description')
      expect(post).toHaveProperty('userId')
      expect(post).toHaveProperty('user')
      expect(post).toHaveProperty('createdAt')
      expect(post).toHaveProperty('updatedAt')
      expect(post).toHaveProperty('comments')
      expect(post).toHaveProperty('files')
      expect(post).toHaveProperty('upvotes')
      expect(post).toHaveProperty('isResolved')
    })

    it('should have properly linked user objects', () => {
      const posts = getMockPosts()
      const post = posts[0]
      
      expect(post.user).toBeDefined()
      expect(post.user.id).toBe(post.userId)
    })

    it('should have properly linked comment user objects', () => {
      const posts = getMockPosts()
      const post = posts[0]
      
      post.comments.forEach(comment => {
        expect(comment.user).toBeDefined()
        expect(comment.user.id).toBe(comment.userId)
      })
    })
  })

  describe('getMockPostById', () => {
    it('should return post when found', () => {
      const post = getMockPostById('post1')
      expect(post).toBeDefined()
      expect(post?.id).toBe('post1')
    })

    it('should return undefined when post not found', () => {
      const post = getMockPostById('nonexistent')
      expect(post).toBeUndefined()
    })

    it('should return a deep copy of the post', () => {
      const post1 = getMockPostById('post1')
      const post2 = getMockPostById('post1')
      
      expect(post1).not.toBe(post2) // Different object references
    })
  })

  describe('addMockPost', () => {
    it('should add a new post successfully', () => {
      const initialCount = getMockPosts().length
      
      const newPost = addMockPost({
        title: 'Test Post',
        description: 'Test Description',
        language: 'javascript',
        tags: ['test'],
        files: []
      }, 'user1')
      
      expect(newPost).toBeDefined()
      expect(newPost.id).toBeDefined()
      expect(newPost.title).toBe('Test Post')
      expect(newPost.userId).toBe('user1')
      expect(newPost.user).toBeDefined()
      expect(newPost.createdAt).toBeDefined()
      expect(newPost.updatedAt).toBeDefined()
      expect(newPost.comments).toEqual([])
      expect(newPost.upvotes).toBe(0)
      expect(newPost.isResolved).toBe(false)
      
      const updatedPosts = getMockPosts()
      expect(updatedPosts.length).toBe(initialCount + 1)
    })

    it('should throw error when user not found', () => {
      expect(() => {
        addMockPost({
          title: 'Test Post',
          description: 'Test Description',
          language: 'javascript',
          tags: ['test'],
          files: []
        }, 'nonexistent-user')
      }).toThrow('User not found')
    })
  })

  describe('addMockComment', () => {
    it('should add a new comment successfully', () => {
      const postId = 'post1'
      const initialCommentCount = getMockPostById(postId)?.comments.length || 0
      
      const newComment = addMockComment(postId, {
        content: 'Test comment',
        isAI: false
      }, 'user1')
      
      expect(newComment).toBeDefined()
      expect(newComment.id).toBeDefined()
      expect(newComment.postId).toBe(postId)
      expect(newComment.content).toBe('Test comment')
      expect(newComment.userId).toBe('user1')
      expect(newComment.user).toBeDefined()
      expect(newComment.createdAt).toBeDefined()
      
      const updatedPost = getMockPostById(postId)
      expect(updatedPost?.comments.length).toBe(initialCommentCount + 1)
    })

    it('should throw error when post not found', () => {
      expect(() => {
        addMockComment('nonexistent-post', {
          content: 'Test comment',
          isAI: false
        }, 'user1')
      }).toThrow('Post or User not found')
    })

    it('should throw error when user not found', () => {
      expect(() => {
        addMockComment('post1', {
          content: 'Test comment',
          isAI: false
        }, 'nonexistent-user')
      }).toThrow('Post or User not found')
    })
  })

  describe('updateMockUserPlan', () => {
    it('should update user plan successfully', () => {
      const newPlan: Plan = 'Community'
      const updatedUser = updateMockUserPlan('user1', newPlan)
      
      expect(updatedUser).toBeDefined()
      expect(updatedUser?.plan).toBe(newPlan)
      expect(updatedUser?.id).toBe('user1')
    })

    it('should return undefined when user not found', () => {
      const updatedUser = updateMockUserPlan('nonexistent', 'Community')
      expect(updatedUser).toBeUndefined()
    })

    it('should return a deep copy of the updated user', () => {
      const user1 = updateMockUserPlan('user1', 'Standard')
      const user2 = updateMockUserPlan('user1', 'Community')
      
      expect(user1).not.toBe(user2) // Different object references
    })
  })

  describe('Data integrity', () => {
    it('should maintain referential integrity between posts and users', () => {
      const posts = getMockPosts()
      const users = getMockUsers()
      
      posts.forEach(post => {
        const user = users.find(u => u.id === post.userId)
        expect(user).toBeDefined()
        expect(post.user.id).toBe(user?.id)
      })
    })

    it('should maintain referential integrity between comments and users', () => {
      const posts = getMockPosts()
      const users = getMockUsers()
      
      posts.forEach(post => {
        post.comments.forEach(comment => {
          const user = users.find(u => u.id === comment.userId)
          expect(user).toBeDefined()
          expect(comment.user.id).toBe(user?.id)
        })
      })
    })

    it('should have valid date strings', () => {
      const users = getMockUsers()
      const posts = getMockPosts()
      
      users.forEach(user => {
        expect(() => new Date(user.lastLogin)).not.toThrow()
        user.recentActivities?.forEach(activity => {
          expect(() => new Date(activity.timestamp)).not.toThrow()
        })
      })
      
      posts.forEach(post => {
        expect(() => new Date(post.createdAt)).not.toThrow()
        expect(() => new Date(post.updatedAt)).not.toThrow()
        post.comments.forEach(comment => {
          expect(() => new Date(comment.createdAt)).not.toThrow()
        })
      })
    })
  })
})
