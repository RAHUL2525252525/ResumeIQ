import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KeywordChips from '../components/KeywordChips.jsx'

describe('KeywordChips', () => {
  it('renders each keyword as a chip', () => {
    render(<KeywordChips title="Matched" keywords={['python', 'django']} variant="matched" />)
    expect(screen.getByText('python')).toBeInTheDocument()
    expect(screen.getByText('django')).toBeInTheDocument()
  })

  it('shows empty text when there are no keywords', () => {
    render(<KeywordChips title="Missing" keywords={[]} variant="missing" emptyText="All good" />)
    expect(screen.getByText('All good')).toBeInTheDocument()
  })
})
