import { createRouter, createWebHistory } from "vue-router"

import LoginView from "../views/LoginView.vue"
import WaitingView from "../views/WaitingView.vue"
import FormView from "../views/FormView.vue"
import ThankYouView from "../views/ThankYouView.vue"
import ProgressView from "../views/ProgressView.vue"
import AlreadyCompletedView from "../views/AlreadyCompletedView.vue"
import RankingView from "../views/RankingView.vue"

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
},
{
  path:"/already-completed",
  name:"already-completed",
  component:AlreadyCompletedView
},
{
  path:"/ranking",
  name:"ranking",
  component:RankingView
}

]

const router = createRouter({

  history:createWebHistory(),
  routes

})

export default router