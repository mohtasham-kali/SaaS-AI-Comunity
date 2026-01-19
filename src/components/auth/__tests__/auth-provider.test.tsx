import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../auth-provider'

// Mock Supabase auth provider
const mockSupabaseAuth = {
  user: null,
  profile: null,
  session: null,
  loading: false,
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  updateUserPlan: jest.fn(),
}

jest.mock('../supabase-auth-provider', () => ({
  useSupabaseAuth: () => mockSupabaseAuth,
}))

// Test component that uses the auth context
const TestComponent = () => {
  const { currentUser, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <div data-testid="user-info">
        {currentUser ? `Logged in as ${currentUser.name}` : 'Not logged in'}
      </div>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabaseAuth.user = null
    mockSupabaseAuth.profile = null
    mockSupabaseAuth.loading = false
  })

  it('renders auth provider without errors', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    // The component should render without throwing
    expect(screen.getByTestId('user-info')).toBeInTheDocument()
  })

  it('shows not logged in when no user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in')
  })

  it('shows logged in when user exists', async () => {
    mockSupabaseAuth.profile = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      image: null,
      plan: 'free',
      aiResponsesToday: 0,
      aiResponsesThisWeek: 0,
      lastLogin: new Date().toISOString(),
      recentActivities: []
    }
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as Test User')
  })

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })
})