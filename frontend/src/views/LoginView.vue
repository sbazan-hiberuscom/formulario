<template>
  <div class="login-container">
    <Card style="width: 400px">
      <template #title>Login</template>

      <template #content>
        <div class="field">
          <label>Usuario</label>
          <InputText v-model="username" />
        </div>

        <div class="field">
          <label>Password</label>
          <Password v-model="password" toggleMask :feedback="false" />
        </div>

        <Button 
          label="Entrar"
          class="p-button-primary"
          @click="login"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>

import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Button from "primevue/button"
import Card from "primevue/card"

const username = ref("")
const password = ref("")

const router = useRouter()

async function login(){

  try{

    const res = await axios.post("http://localhost:3000/login",{
      username: username.value,
      password: password.value
    })

    localStorage.setItem("token",res.data.token)

    router.push("/waiting")

  }catch(e){

    alert("Login incorrecto")

  }

}

</script>

<style>

.login-container{
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
}

.field{
  margin-bottom:20px;
  display:flex;
  flex-direction:column;
}

.field label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.field input {
  width: 100%;
}

</style>