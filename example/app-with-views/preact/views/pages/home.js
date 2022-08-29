import { h } from 'preact'
import { tw } from 'twind'
import Layout from '../components/Layout'
import Content from '../components/Content'
/** @jsx h */

const Heading = (props) => {
    return <Layout route='/' color=''>
        <Content>
            <h1 className={tw`font-bold text-center text-red-400`}>{props.heading}</h1>
        </Content>
    </Layout>
}

export default Heading
