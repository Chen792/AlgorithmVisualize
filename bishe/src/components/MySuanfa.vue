<template>
    <div>
        <ShowAlgorithm></ShowAlgorithm>
        <RemarkAlgorithm></RemarkAlgorithm>
    </div>
</template>

<script>
import ShowAlgorithm from '../components/ShowAlgorithm.vue';
import RemarkAlgorithm from '../components/RemarkAlgorithm.vue';
export default {
    components:{
        ShowAlgorithm,
        RemarkAlgorithm
    }
}
</script>

<style>
.main {
    height: 100%;
}
</style>