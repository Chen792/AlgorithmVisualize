<template>
  <div class="showComment">
    <AlgoShowComments></AlgoShowComments>
   <AlgoWriteComments></AlgoWriteComments>
  </div>
</template>

<script>
import AlgoShowComments from './AlgoShowComments.vue';
import AlgoWriteComments from './AlgoWriteComments.vue';
export default {
  components:{
    AlgoShowComments,AlgoWriteComments
  },
}
</script>

<style scoped>
  .showComment {
    display: flex;
    justify-content: space-between;
  }

</style>