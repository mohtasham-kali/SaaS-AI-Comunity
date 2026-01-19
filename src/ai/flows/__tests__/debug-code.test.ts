import { type DebugCodeInput, type DebugCodeOutput } from '../debug-code'

describe('debugCode Types', () => {
  it('should accept valid input with required fields', () => {
    const input: DebugCodeInput = {
      problemDescription: 'Test problem',
    }
    
    expect(input.problemDescription).toBe('Test problem')
    expect(input.codeSnippet).toBeUndefined()
    expect(input.language).toBeUndefined()
    expect(input.uploadedFiles).toBeUndefined()
  })

  it('should accept input with all optional fields', () => {
    const input: DebugCodeInput = {
      problemDescription: 'Test problem',
      codeSnippet: 'console.log("hello");',
      language: 'javascript',
      uploadedFiles: ['data:text/plain;base64,SGVsbG8gV29ybGQ=']
    }
    
    expect(input.problemDescription).toBe('Test problem')
    expect(input.codeSnippet).toBe('console.log("hello");')
    expect(input.language).toBe('javascript')
    expect(input.uploadedFiles).toHaveLength(1)
  })

  it('should handle empty uploadedFiles array', () => {
    const input: DebugCodeInput = {
      problemDescription: 'Test problem',
      uploadedFiles: []
    }
    
    expect(input.uploadedFiles).toEqual([])
  })

  it('should handle multiple uploaded files', () => {
    const input: DebugCodeInput = {
      problemDescription: 'Test problem',
      uploadedFiles: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'data:text/plain;base64,SGVsbG8gV29ybGQ='
      ]
    }
    
    expect(input.uploadedFiles).toHaveLength(2)
    expect(input.uploadedFiles![0]).toMatch(/^data:image\/png;base64,/)
    expect(input.uploadedFiles![1]).toMatch(/^data:text\/plain;base64,/)
  })

  it('should handle various programming languages', () => {
    const languages = ['javascript', 'python', 'java', 'typescript', 'go', 'rust']
    
    languages.forEach(lang => {
      const input: DebugCodeInput = {
        problemDescription: 'Test problem',
        language: lang
      }
      expect(input.language).toBe(lang)
    })
  })

  it('should handle output type correctly', () => {
    const output: DebugCodeOutput = {
      explanation: 'Test explanation',
      suggestions: 'Test suggestions',
      debuggedCode: 'console.log("fixed");'
    }
    
    expect(output.explanation).toBe('Test explanation')
    expect(output.suggestions).toBe('Test suggestions')
    expect(output.debuggedCode).toBe('console.log("fixed");')
  })
})