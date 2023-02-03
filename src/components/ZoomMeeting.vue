<template>
  <div class="text-h1">Zoom</div>
</template>

<script>
  import {ZoomMtg} from '@zoomus/websdk'

  export default {
    data() {
      return {

      }
    },
    methods: {
      joinMeeting(payload) {

      }
    },
    created() {
      this.joinMeeting(this)
    }
  }
</script>
