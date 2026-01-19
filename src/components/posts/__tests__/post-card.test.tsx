import { render, screen } from '@testing-library/react'
import { PostCard } from '../post-card'
import type { Post } from '@/types'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MessageSquare: () => <div data-testid="message-square">💬</div>,
  ThumbsUp: () => <div data-testid="thumbs-up">👍</div>,
  CheckCircle2: () => <div data-testid="check-circle">✅</div>,
}))

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNowStrict: jest.fn(() => '2 hours ago')
}))

const mockPost: Post = {
  id: 'post-1',
  title: 'Test Post Title',
  description: 'This is a test post description.',
  content: 'Full post content here...',
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://example.com/avatar.jpg',
    plan: 'free',
    aiResponsesToday: 0,
    aiResponsesThisWeek: 0,
    lastLogin: '2024-01-01T00:00:00.000Z',
    recentActivities: []
  },
  tags: ['javascript', 'react'],
  upvotes: 5,
  comments: [
    { id: 'comment-1', content: 'Great post!', user: 'user-2', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 'comment-2', content: 'Very helpful', user: 'user-3', createdAt: '2024-01-01T00:00:00.000Z' }
  ],
  isResolved: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

describe('PostCard Component', () => {
  it('renders post title as a link', () => {
    render(<PostCard post={mockPost} />)
    const titleLink = screen.getByRole('link', { name: /test post title/i })
    expect(titleLink).toBeInTheDocument()
    expect(titleLink).toHaveAttribute('href', '/posts/post-1')
  })

  it('renders post description', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('This is a test post description.')).toBeInTheDocument()
  })

  it('renders user information', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders tags when provided', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
  })

  it('renders upvote and comment counts', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('5')).toBeInTheDocument() // upvotes
    expect(screen.getByText('2')).toBeInTheDocument() // comments
  })

  it('renders view post button', () => {
    render(<PostCard post={mockPost} />)
    const viewButton = screen.getByRole('link', { name: /view post/i })
    expect(viewButton).toBeInTheDocument()
    expect(viewButton).toHaveAttribute('href', '/posts/post-1')
  })

  it('handles user with no name', () => {
    const noNamePost = {
      ...mockPost,
      user: { ...mockPost.user, name: null }
    }
    render(<PostCard post={noNamePost} />)
    expect(screen.getByText('??')).toBeInTheDocument()
  })
})