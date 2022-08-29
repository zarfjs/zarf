import * as React from 'react'

interface LayoutProps {
    color: string
    route: string
}

const Layout = (props: React.PropsWithChildren<LayoutProps>) => (
    <div className="layout">
      <header className="header">Header goes here</header>
      <main id="content" tabIndex="-1" className="main">{props.children}</main>
    </div>
)

export default Layout
