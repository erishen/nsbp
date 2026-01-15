import styled from 'styled-components'

export const Container = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.85)
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
    flex-direction: column;
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const LogoWrapper = styled.div`
  text-decoration: none;
  font-size: 1.375rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;

  span:first-child {
    font-size: 1.625rem;
    color: #667eea;
  }

  &:hover {
    transform: scale(1.03);
    filter: drop-shadow(0 2px 6px rgba(102, 126, 234, 0.25));
  }

  @media (max-width: 768px) {
    font-size: 1.1875rem;

    span:first-child {
      font-size: 1.4375rem;
    }
  }
`

export const Nav = styled.nav`
  display: flex;
  gap: 0.375rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`

export const NavLink = styled.div<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  text-decoration: none;
  border-radius: 999px;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scale(0);
    width: 70%;
    height: 1.5px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 999px;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.2);
    transform: translateY(-1px);
    box-shadow:
      0 3px 8px rgba(102, 126, 234, 0.12),
      0 1px 3px rgba(102, 126, 234, 0.08);
  }

  &:hover::before {
    transform: translateX(-50%) scale(1);
  }

  ${(props) =>
    props.$active &&
    `
    color: #ffffff;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    box-shadow:
      0 3px 8px rgba(102, 126, 234, 0.2),
      0 1px 3px rgba(102, 126, 234, 0.12);

    &::before {
      transform: translateX(-50%) scale(1);
      background: rgba(255,255,255, 0.3);
      height: 1.5px;
    }

    &:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b3e8e 100%);
      transform: translateY(-1px);
    }
  `}

  @media (max-width: 768px) {
    padding: 0.4375rem 0.875rem;
    font-size: 0.8125rem;
    gap: 0.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    width: 100%;
    justify-content: center;
  }
`
