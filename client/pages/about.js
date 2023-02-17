import Link from 'next/link'
import Layout from '@/components/layout'

function AboutPage() {
  return (
    <>
      <Layout title='About this Program'>
      <div className='container'>
      <div className='textbox'>
        <h1>About this App</h1>
          <p>
            This is a demo website built in Microservice architecture.
            Basic Components:
            User Authentication Components
            Ticket Create, Update, Deletion Components
            Order Create, Update Components
            Payment Components
            File Upload Components
            Event Expiration Triggers
            Information Dashboard and more...
          </p>

        </div>
        <Link href='/' className=''>Return to Home Page</Link>
      </div>
      
      </Layout>
    </>
  )
}

export default AboutPage