<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    if (window.localStorage.getItem('roles') == 1) {
      this.$socket.emit('LOGIN', {
        type: 'onLine',
        body: {
          id: window.localStorage.getItem('user_id'),
          avatar: window.localStorage.getItem('avatar'),
          nickName: window.localStorage.getItem('name'),
          message: {
            content: '',
            time: new Date()
          }
        }
      })
    }
  }
}
</script>
