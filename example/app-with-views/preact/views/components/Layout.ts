import type { ComponentChildren } from 'preact'
import { html } from '../utils/html'

interface LayoutProps {
    children: ComponentChildren,
    heading?: string
}

const Layout = ({ children, heading }: LayoutProps) =>
    html`
        <div class="layout">
            <header class="header">${heading || 'heading goes here'}</header>
            <main id="content" tabIndex="-1" class="main">${children}</main>
        </div>
    `

export default Layout
