import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ScoreGauge from '../components/ScoreGauge.jsx'

describe('ScoreGauge', () => {
  it('renders the rounded score value', () => {
    render(<ScoreGauge score={82.6} label="ATS Score" />)
    expect(screen.getByText('83')).toBeInTheDocument()
    expect(screen.getByText('ATS Score')).toBeInTheDocument()
  })

  it('clamps scores above 100', () => {
    render(<ScoreGauge score={140} label="ATS Score" />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('clamps negative scores to 0', () => {
    render(<ScoreGauge score={-20} label="ATS Score" />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
