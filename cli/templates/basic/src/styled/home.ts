import styled, { keyframes } from 'styled-components'

// ============================================
// 基础容器
// ============================================

export const GlobalStyle = styled.div`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #2d3748;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: #667eea;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #764ba2;
    }
  }
`

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

// ============================================
// Hero Section（首屏）
// ============================================

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 70vh;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    min-height: 60vh;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
    min-height: 50vh;
  }
`

export const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    max-width: 600px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 1rem;
  }
`

export const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
`

export const HeroSubtitle = styled.p`
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  color: rgba(255, 255, 255, 0.9);
  margin: 0 auto 2rem;
  line-height: 1.7;
  max-width: 600px;
  text-align: center;
`

export const HeroBadge = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 1rem;
`

export const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-align: center;
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`

export const StatLabel = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
`

// ============================================
// 技术特性卡片
// ============================================

export const TechSection = styled.section`
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`

export const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
`

export const SectionDescription = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.7;
`

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const FeatureCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`

export const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`

export const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
`

export const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 1rem;
`

export const CodeExample = styled.pre`
  background: #1e293b;
  color: #f8f8fa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`

// ============================================
// 对比表格
// ============================================

export const ComparisonSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
`

export const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`

export const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
`

export const TableRow = styled.tr`
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(102, 126, 234, 0.03);
  }
`

export const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  color: #2d3748;
  border-right: 1px solid rgba(0, 0, 0, 0.06);

  &:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
`

export const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const NsbpJSBadge = styled.span`
  background: #667eea;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`

export const NextJSBadge = styled.span`
  background: #6b7280;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`

// ============================================
// Photo Menu
// ============================================

export const PhotoSection = styled.section`
  padding: 6rem 2rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const PhotoGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 1200px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const PhotoCard = styled.li`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
  }
`

export const PhotoImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
`

export const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${PhotoCard}:hover & {
    transform: scale(1.1);
  }
`

export const PhotoName = styled.div`
  padding: 1rem;
  text-align: center;
  background: #ffffff;
`

export const PhotoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`

export const PhotoCount = styled.span`
  display: inline-block;
  background: #667eea;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`

// ============================================
// 加载状态
// ============================================

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(102, 126, 234, 0.15);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

export const LoadingText = styled.span`
  margin-left: 1rem;
  color: #6b7280;
  font-size: 1rem;
`

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  max-width: 400px;
  margin: 2rem auto;
`

export const ErrorTitle = styled.h3`
  color: #ef4444;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`

export const ErrorMessage = styled.p`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
`

// ============================================
// 快速开始
// ============================================

export const QuickStartSection = styled.section`
  padding: 6rem 2rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const QuickStartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const QuickStartCard = styled.div`
  background: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 2rem;
`

export const QuickStartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const QuickStartCode = styled.pre`
  background: #1e293b;
  color: #f8f8fa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.6;
`

export const QuickStartDescription = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.6;
  margin-top: 1rem;
`

// ============================================
// Footer
// ============================================

export const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  color: #6b7280;
  font-size: 0.9rem;
`
