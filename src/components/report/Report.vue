<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <!-- 2. 为ECharts准备一个具备宽高的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 1. 导入echarts
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
    data() {
        return {
            // 需要合并的数据
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    created() {
    },
    // 此时，页面上的Dom元素，已经被渲染完毕了
    async mounted() {
        // 3. 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) return this.$message.error('数据获取失败！')
        this.$message.success('数据获取成功！')

        // 4. 准备数据和配置项
        const result = _.merge(res.data, this.options)
        // const result = {...this.options, ...res.data}
        // 5. 展示数据，绘制图表
        myChart.setOption(result);
    },
    methods: {
    }
}
</script>

<style>

</style>