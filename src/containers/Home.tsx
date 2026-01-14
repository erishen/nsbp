import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@components/Layout'
import { Helmet } from 'react-helmet'
import {
  GlobalStyle,
  PageWrapper,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  HeroBadge,
  HeroStats,
  StatCard,
  StatValue,
  StatLabel,
  TechSection,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  FeatureGrid,
  FeatureCard,
  CardIcon,
  CardTitle,
  CardDescription,
  CodeExample,
  ComparisonSection,
  ComparisonTable,
  TableHeader,
  TableRow,
  TableCell,
  TableHeaderCell,
  NsbpJSBadge,
  NextJSBadge,
  PhotoSection,
  PhotoGrid,
  PhotoCard,
  PhotoImageWrapper,
  PhotoImage,
  PhotoName,
  PhotoTitle,
  PhotoCount,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  QuickStartSection,
  QuickStartGrid,
  QuickStartCard,
  QuickStartTitle,
  QuickStartCode,
  QuickStartDescription,
  DemoButtonLink,
  DemoButtonIcon,
  Footer
} from '../styled/home'

interface PhotoMenuItem {
  name: string
  cover?: string
  count?: number
}

const Home: React.FC = () => {
  const [menu, setMenu] = useState<PhotoMenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setLoading(true)
    // 先检查服务端是否已预取了图片菜单数据
    const serverMenu = window?.context?.state?.photo?.menu || {}
    const serverMenuArray = Array.isArray(serverMenu) ? serverMenu : []

    if (serverMenuArray.length > 0) {
      setMenu(serverMenuArray)
      setLoading(false)
    } else {
      // 如果服务端没有预取，则在客户端获取
      fetch('/getPhotoMenu')
        .then(res => {
          if (!res.ok) throw new Error(`Status ${res.status}`)
          return res.json()
        })
        .then(data => {
          setMenu(data?.data || [])
        })
        .catch(err => {
          console.error('Failed to load menu:', err)
          setMenu([])
        })
        .finally(() => setLoading(false))
    }
  }, [])

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // 模拟页面加载
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <GlobalStyle>
      {!isLoaded && (
        <div className="page-loader" id="pageLoader">
          <div className="loader-spinner"></div>
        </div>
      )}
      <script dangerouslySetInnerHTML={{
        __html: `
          setTimeout(() => {
            const loader = document.getElementById('pageLoader');
            if (loader) {
              loader.classList.add('fade-out');
              setTimeout(() => loader.remove(), 500);
            }
          }, 800);
        `
      }} />
      <Helmet>
        <title>Nsbp.js - 轻量级 React SSR 框架</title>
        <meta name="description" content="Nsbp.js - 一个轻量级 React SSR 框架，专为低资源部署与高度可定制场景而生。与 Next.js 相比，更节省资源，更灵活配置。查看线上演示：https://nsbp.erishen.cn/" />
        <meta name="keywords" content="Nsbp.js, React SSR, 轻量级, SSR, TypeScript, React 19" />
        <meta property="og:title" content="Nsbp.js - 轻量级 React SSR 框架" />
        <meta property="og:description" content="与 Next.js 相比，Nsbp.js 更轻量、更灵活、更可控。查看线上演示：https://nsbp.erishen.cn/" />
        <meta property="og:url" content="https://nsbp.erishen.cn/" />
      </Helmet>

      <Layout query={{}}>
        <PageWrapper>

          {/* ========================================
              Hero Section - 首屏视觉冲击
              ======================================== */}
          <HeroSection className="fade-in">
            <HeroContent>
              <div className="hero-glow"></div>
              <div className="hero-glow"></div>
              <HeroBadge className="fade-in" style={{animationDelay: '0.1s'}}>🚀 轻量级 React SSR 框架</HeroBadge>
              <HeroTitle className="fade-in" style={{animationDelay: '0.2s'}}>Nsbp.js</HeroTitle>
              <HeroSubtitle className="fade-in" style={{animationDelay: '0.3s'}}>
                与 Next.js 相比，节省 60% 资源消耗
                <br />
                完全掌控 Webpack 配置，无黑盒限制
              </HeroSubtitle>

              <DemoButtonLink
                href="https://nsbp.erishen.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="fade-in"
                style={{animationDelay: '0.4s'}}
              >
                <DemoButtonIcon>🌐</DemoButtonIcon>
                查看线上演示
              </DemoButtonLink>

              <HeroStats>
                <StatCard>
                  <StatValue>~60%</StatValue>
                  <StatLabel>更少资源</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>512MB</StatValue>
                  <StatLabel>最低内存</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>100%</StatValue>
                  <StatLabel>可定制</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>TS</StatValue>
                  <StatLabel>类型安全</StatLabel>
                </StatCard>
              </HeroStats>
            </HeroContent>
          </HeroSection>

          {/* ========================================
              技术特性展示
              ======================================== */}
          <TechSection className="fade-in" style={{animationDelay: '0.4s'}}>
            <SectionHeader>
              <SectionTitle className="fade-in" style={{animationDelay: '0.5s'}}>核心特性</SectionTitle>
              <SectionDescription className="fade-in" style={{animationDelay: '0.6s'}}>
                基于 React 19 + TypeScript，提供完整的 SSR 能力同时保持极致轻量
              </SectionDescription>
            </SectionHeader>

            <FeatureGrid>
              <FeatureCard>
                <CardIcon>⚡</CardIcon>
                <CardTitle>极速服务端渲染</CardTitle>
                <CardDescription>
                  服务端渲染 HTML，SEO 友好，首屏秒开
                </CardDescription>
                <CodeExample>{`// 路由 + 预取数据
// Routers.tsx
export default [
  {
    path: '/',
    component: Home,
    exact: true,
    loadData: homeLoadData,
    key: 'home'
  }
]`}</CodeExample>
              </FeatureCard>

              <FeatureCard>
                <CardIcon>🔧</CardIcon>
                <CardTitle>完全可控的 Webpack</CardTitle>
                <CardDescription>
                  无黑盒配置，自定义任何构建逻辑
                </CardDescription>
                <CodeExample>{`// 自定义 Webpack 配置
// webpack.server.js
module.exports = {
  // 你的配置
}`}</CodeExample>
              </FeatureCard>

              <FeatureCard>
                <CardIcon>📦</CardIcon>
                <CardTitle>智能代码分割</CardTitle>
                <CardDescription>
                  基于 @loadable/component，按需加载
                </CardDescription>
                <CodeExample>{`// 组件懒加载
import loadable from '@loadable/component'

const Home = loadable(() => import('./containers/Home'))`}</CodeExample>
              </FeatureCard>

              <FeatureCard>
                <CardIcon>🧩</CardIcon>
                <CardTitle>React 19 原生支持</CardTitle>
                <CardDescription>
                  利用最新 React 特性，性能和开发体验提升
                </CardDescription>
                <CodeExample>{`// React 19 新特性
import { use, useTransition } from 'react'

// Server Actions
// Suspense 边界
// use Optimistic`}</CodeExample>
              </FeatureCard>

              <FeatureCard>
                <CardIcon>📝</CardIcon>
                <CardTitle>TypeScript 类型安全</CardTitle>
                <CardDescription>
                  完整的类型推断，编译时错误检查
                </CardDescription>
                <CodeExample>{`interface PhotoMenuItem {
  name: string
  cover?: string
  count?: number
}`}</CodeExample>
              </FeatureCard>

              <FeatureCard>
                <CardIcon>🖼️</CardIcon>
                <CardTitle>内置图片服务</CardTitle>
                <CardDescription>
                  开箱即用的图片分类和管理接口
                </CardDescription>
                <CodeExample>{`// 图片服务
// src/server/photo.ts
export const getPhotoMenu = (req: any, res: any) => {
  const photosDicPath = getPublicImagesPath()
  const fileMenu = getFileMenu(photosDicPath)
  res.json({ data: fileMenu })
}`}</CodeExample>
              </FeatureCard>
            </FeatureGrid>
          </TechSection>

          {/* ========================================
              Nsbp.js vs Next.js 对比
              ======================================== */}
          <ComparisonSection className="fade-in" style={{animationDelay: '0.7s'}}>
            <SectionHeader>
              <SectionTitle className="fade-in" style={{animationDelay: '0.8s'}}>Nsbp.js vs Next.js</SectionTitle>
              <SectionDescription className="fade-in" style={{animationDelay: '0.9s'}}>
                对比两个 SSR 框架的关键差异，帮助你做出正确选择
              </SectionDescription>
            </SectionHeader>

            <ComparisonTable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>特性</TableHeaderCell>
                  <TableHeaderCell><NsbpJSBadge>Nsbp.js</NsbpJSBadge></TableHeaderCell>
                  <TableHeaderCell><NextJSBadge>Next.js</NextJSBadge></TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                <TableRow>
                  <TableCell><strong>运行时体积</strong></TableCell>
                  <TableCell>~5MB</TableCell>
                  <TableCell>~20MB</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>最低内存</strong></TableCell>
                  <TableCell>512MB</TableCell>
                  <TableCell>1GB+</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>构建配置</strong></TableCell>
                  <TableCell>✅ 完全可控</TableCell>
                  <TableCell>❌ 黑盒封装</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>代码分割</strong></TableCell>
                  <TableCell>✅ @loadable/component</TableCell>
                  <TableCell>✅ 自动（但有限制）</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>SSR 渲染</strong></TableCell>
                  <TableCell>✅ 手动控制</TableCell>
                  <TableCell>✅ 自动（但可调）</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>学习曲线</strong></TableCell>
                  <TableCell>🟡 中等</TableCell>
                  <TableCell>🟢 简单</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>生态集成</strong></TableCell>
                  <TableCell>✅ 任意 React 库</TableCell>
                  <TableCell>⚠️ 需要官方方案</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>适用场景</strong></TableCell>
                  <TableCell>博客、官网、教学</TableCell>
                  <TableCell>企业应用、电商</TableCell>
                </TableRow>
              </tbody>
            </ComparisonTable>
          </ComparisonSection>

          {/* ========================================
              快速开始
              ======================================== */}
          <QuickStartSection className="fade-in" style={{animationDelay: '1.0s'}}>
            <SectionHeader>
              <SectionTitle className="fade-in" style={{animationDelay: '1.1s'}}>快速开始</SectionTitle>
              <SectionDescription className="fade-in" style={{animationDelay: '1.2s'}}>
                三步启动你的第一个 SSR 项目
              </SectionDescription>
            </SectionHeader>

            <QuickStartGrid>
              <QuickStartCard>
                <QuickStartTitle>1️⃣ 创建项目</QuickStartTitle>
                <QuickStartCode>$ npx nsbp-cli create my-app</QuickStartCode>
                <QuickStartDescription>
                  使用 CLI 工具创建新项目
                </QuickStartDescription>
              </QuickStartCard>

              <QuickStartCard>
                <QuickStartTitle>2️⃣ 启动开发</QuickStartTitle>
                <QuickStartCode>$ pnpm run dev</QuickStartCode>
                <QuickStartDescription>
                  启动开发服务器，默认端口 3001
                </QuickStartDescription>
              </QuickStartCard>

              <QuickStartCard>
                <QuickStartTitle>3️⃣ 访问应用</QuickStartTitle>
                <QuickStartCode>http://localhost:3001</QuickStartCode>
                <QuickStartDescription>
                  浏览器访问，开始开发
                </QuickStartDescription>
              </QuickStartCard>
            </QuickStartGrid>
          </QuickStartSection>

          {/* ========================================
              Photo Menu 示例
              ======================================== */}
          <PhotoSection className="fade-in" style={{animationDelay: '1.3s'}}>
            <SectionHeader>
              <SectionTitle className="fade-in" style={{animationDelay: '1.4s'}}>图片分类示例</SectionTitle>
              <SectionDescription className="fade-in" style={{animationDelay: '1.5s'}}>
                基于 Nsbp.js 内置的图片服务接口，快速构建图库应用
              </SectionDescription>
            </SectionHeader>

            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>加载分类...</LoadingText>
              </LoadingContainer>
            ) : menu.length > 0 ? (
              <PhotoGrid>
                {menu.map(item => (
                  <Link key={item.name} to={`/photo?dic=${item.name}`}>
                    <PhotoCard>
                      <PhotoImageWrapper>
                        <PhotoImage
                          src={item.cover || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
                          alt={item.name}
                          loading="lazy"
                        />
                      </PhotoImageWrapper>
                      <PhotoName>
                        <PhotoTitle>{item.name}</PhotoTitle>
                        {typeof item.count === 'number' && (
                          <PhotoCount>{item.count} 张</PhotoCount>
                        )}
                      </PhotoName>
                    </PhotoCard>
                  </Link>
                ))}
              </PhotoGrid>
            ) : (
              <ErrorContainer>
                <ErrorTitle>❌ 暂无分类</ErrorTitle>
                <ErrorMessage>
                  请在 public/images 目录下创建图片文件夹
                </ErrorMessage>
              </ErrorContainer>
            )}
          </PhotoSection>

          {/* ========================================
              Footer
              ======================================== */}
          <Footer>
            <p>© 2025 Nsbp.js. Built with React 19 + TypeScript.</p>
          </Footer>

        </PageWrapper>
      </Layout>
    </GlobalStyle>
  )
}

export default Home
