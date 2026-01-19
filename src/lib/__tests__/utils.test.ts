import { cn } from '../utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false
    
    const result = cn(
      'base-class',
      {
        'active-class': isActive,
        'disabled-class': isDisabled,
      }
    )
    expect(result).toBe('base-class active-class')
  })

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles mixed input types', () => {
    const result = cn(
      'base',
      ['array1', 'array2'],
      {
        'conditional-true': true,
        'conditional-false': false,
      },
      'final'
    )
    expect(result).toBe('base array1 array2 conditional-true final')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined, false)).toBe('')
  })

  it('handles undefined and null values', () => {
    const result = cn('valid', undefined, null, 'also-valid')
    expect(result).toBe('valid also-valid')
  })

  it('merges conflicting Tailwind classes correctly', () => {
    // This tests that twMerge is working properly
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500') // Last one should win
  })

  it('handles complex conditional logic', () => {
    const variant = 'primary'
    const size = 'large'
    const disabled = false
    
    const result = cn(
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-small': size === 'small',
        'btn-large': size === 'large',
        'btn-disabled': disabled,
      }
    )
    expect(result).toBe('btn btn-primary btn-large')
  })

  it('handles nested arrays and objects', () => {
    const result = cn(
      ['outer1', 'outer2'],
      {
        'nested-true': true,
        'nested-false': false,
      },
      ['inner1', 'inner2']
    )
    expect(result).toBe('outer1 outer2 nested-true inner1 inner2')
  })

  it('preserves order of non-conflicting classes', () => {
    const result = cn('first', 'second', 'third')
    expect(result).toBe('first second third')
  })
})
