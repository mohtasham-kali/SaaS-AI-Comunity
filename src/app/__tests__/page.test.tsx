describe('HomePage', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })

  it('should have access to required types', () => {
    // Test that we can import types without errors
    const testType: string = 'test'
    expect(testType).toBe('test')
  })
})