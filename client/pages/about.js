import Link from 'next/link'
import Layout from '@/components/Layout'
function AboutPage() {
  return (
    <>
      <Layout title='About this Program'>
        <div>about this app</div>
        <Link href='/'>Home</Link>
      </Layout>
    </>
  )
}

export default AboutPage