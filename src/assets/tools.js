function gotoBottom() {
  const box = document.getElementsByClassName('message-pabel-box')[0]

  this.$nextTick(() => {
    box.scrollTop = box.scrollHeight
  })
}

function close() {
  window.location.href = 'https://xiaobaicai.fun/'
}

export { gotoBottom, close }
