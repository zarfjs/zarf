import { tw } from 'twind'
import { html } from '../utils/html'
import Layout from '../components/Layout'
import Content from '../components/Content'

interface PageProps {
    heading: string
}

const Tpl = ({ heading }: PageProps) =>
    html`
        <${Layout} heading="nice heading" >
            <${Content}>
                <h1 class="${tw`font-bold text-center text-red-400`}">${heading}</h1>
            <//>
        <//>
    `

export default Tpl
