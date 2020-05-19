import React, { useState } from 'react'
import { auth, firestore } from './services/firebase'
import { Header } from './components'
import { Drawer } from './ui'
import { LoadingOutlined } from '@ant-design/icons'
import {
  Route,
  Switch,
  Redirect,
  useLocation,
  useParams
} from "react-router-dom"
import {
  Login,
  Crud,
  Game,
  Register,
  Profile,
  ProfileEdit,
  UsersList
} from './pages'
import {
  adminRoutes,
  loginRoutes,
  privateRoutes,
  publicRoutes,
  moderationRoutes,
  getTitle
} from './helpers'

const App = () => {
  const [ loading, setLoading ] = useState(true)
  const [ authenticated, setAuthenticated ] = useState(false)
  const [ isOpenMenu, setIsOpenMenu ] = useState(false)
  const [ menu, setMenu ] = useState([])
  const [ isVisible, setIsVisible ] = useState(true)
  const [ user, setUser ] = useState(null)
  const [ title, setTitle ] = useState(null)
  let location = useLocation()
  const params = useParams()
  
  React.useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register') setIsVisible(false)
    else setIsVisible(true)
    setTitle(getTitle(location.pathname, params))
    auth().onAuthStateChanged((user) => {
      setAuthenticated(user ? true : false)
      if (user) {
        firestore.collection('users').doc(user.uid).onSnapshot(snap => {
          setUser(snap.data())
          setMenu(privateRoutes)
          setLoading(false)
        })
      } else {
        setMenu(publicRoutes)
        setLoading(false)
      }
    })
  }, [location])

  const toggleMenu = () => {
    setIsOpenMenu(!isOpenMenu)
  }

  

  return loading ? <LoadingOutlined className="app-loading" /> : (
    <>
      <Header isVisible={isVisible} toggleMenu={toggleMenu} isOpenMenu={isOpenMenu} title={title}></Header>
      <Drawer toggleMenu={toggleMenu} isOpenMenu={isOpenMenu} list={menu} user={user} />
      <Switch>
        <Route exact path="/"><Game user={user} /></Route>
        <PrivateRoute exact path="/riddles/:action" authenticated={authenticated}><Crud user={user} /></PrivateRoute>
        <PrivateRoute exact path="/users/:uid" authenticated={authenticated}><Profile user={user} /></PrivateRoute>
        <PrivateRoute exact path="/users/:uid/edit" authenticated={authenticated}><ProfileEdit user={user} /></PrivateRoute>
        <PrivateRoute exact path="/users/:uid/list/:type" authenticated={authenticated} component={UsersList}></PrivateRoute>
        <PublicRoute exact path="/register" authenticated={authenticated} component={Register}></PublicRoute>
        <PublicRoute exact path="/login" authenticated={authenticated} component={Login}></PublicRoute>
      </Switch>
    </>
  )
}


function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
    />
  )
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === false
        ? <Component {...props} />
        : <Redirect to='/' />}
    />
  )
}

export default App
