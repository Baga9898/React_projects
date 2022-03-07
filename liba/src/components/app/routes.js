import MainPage from '../pages/mainPage/mainPage';
import AllResources from '../pages/allResources/allResources';
import Websites from '../pages/websites/websites';
import Books from '../pages/books/books';
import Posts from '../pages/posts/posts';

const routes = [
        {path: "/", element: <MainPage/>},
        {path: "/all-resources", element: <AllResources/>},
        {path: "/websites", element: <Websites/>},
        {path: "/books", element: <Books/>},
        {path: "/posts", element: <Posts/>},
    ]

export default routes;