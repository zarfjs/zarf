import type { ComponentChildren } from 'preact'
import { html } from '../utils/html'

interface ContentProps {
    children: ComponentChildren
}

const Content = ({ children }: ContentProps ) =>
    html`
        <div class="content">
            <section>
                <div class="container">${children}</div>
            </section>
        </div>
    `
export default Content
