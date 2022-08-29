import * as React from 'react';
import { tw } from 'twind'
import Layout from '../components/Layout'
import Content from '../components/Content'

const Heading = ({ heading}:{ heading: string}) => {
    return <Layout route='/' color=''>
        <Content>
            <h1 className={tw`font-bold text-center text-red-400`}>{heading}</h1>
        </Content>
    </Layout>
}

export default Heading
