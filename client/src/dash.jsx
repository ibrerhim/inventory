import Card from './card'
import SlideNavbar from './SlideInNavbar'

function Dash() {

  return (
    <div className="flex h-screen ">
      <SlideNavbar />
      <main className={`flex-1 overflow-auto transition-all duration-300 ml-20 lg:ml-64`}>
        <Card />
      </main>
    </div>
  )
}

export default Dash