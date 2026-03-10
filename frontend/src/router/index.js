import { createRouter, createWebHistory } from "vue-router"

import LoginView from "../views/LoginView.vue"
import WaitingView from "../views/WaitingView.vue"
import FormView from "../views/FormView.vue"
import ThankYouView from "../views/ThankYouView.vue"
import ProgressView from "../views/ProgressView.vue"

const routes = [

{
  path:"/",
  name:"login",
  component:LoginView
},
{
  path:"/waiting",
  name:"waiting",
  component:WaitingView
},
{
  path:"/form",
  name:"form",
  component:FormView
},
{
  path:"/thank-you",
  name:"thank-you",
  component:ThankYouView
},
{
  path:"/progress",
  name:"progress",
  component:ProgressView
}

]

const router = createRouter({

  history:createWebHistory(),
  routes

})

export default router