<template>
  <div class="container">
    <van-tabs swipeable v-model="activeIndex">
      <van-tab v-for="item in channels" :title="item.name" :key="item.id">
        <!-- 一个内容可以滚动的容器（记录浏览的位置） -->
        <div class="scroll-wrapper">
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list
              v-model="activeChannel.upLoading"
              :finished="activeChannel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell v-for="article in activeChannel.articles" :key="article.art_id.toString()">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{article.title}}</h3>
                  <div class="img_box" v-if="article.cover.type===3">
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="article.cover.type===1">
                    <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{article.aut_name}}</span>
                    <span>{{article.comm_count}}评论</span>
                    <span>{{article.pubdate|relTime}}</span>
                    <span class="close">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
import { getMyChannels } from '@/api/channel'
import { getArticles } from '@/api/acticle'
export default {
  name: 'home-index',
  data () {
    return {
      // 检测是否正在上拉加载中
      upLoading: false,
      // 检测是否正在下拉刷新中
      // 是否加载完成
      finished: false,
      // 文章列表
      articles: [],
      // 刷新中
      downLoading: false,
      // 刷新后的文本提示
      refreshSuccessText: null,
      // 我的频道(在没有登录的情况下,系统默认给的频道)
      channels: [],
      // 当前激活频道的索引
      activeIndex: 0
    }
  },
  computed: {
    // 当前频道
    activeChannel () {
      return this.channels[this.activeIndex]
    }
  },
  created () {
    // 当列表的数据加载完毕后,文章列表会自动进行加载
    // 默认的第一个频道,是推荐频道,索引一定是为0
    this.getMyChannels()
  },
  methods: {
    async getMyChannels () {
      // eslint-disable-next-line no-unused-vars
      const data = await getMyChannels()
      // 使用map方法遍历新的数组,新的数组中的每一项(遍历的时候,返回值)
      // this.channels = []
      this.channels = data.channels.map(item => ({
        id: item.id,
        name: item.name,
        // 其它数据,等待渲染列表的时候,使用
        upLoading: false,
        // 所有数据加载完毕后
        finished: false,
        // 刷新中
        downLoading: false,
        // 文章列表
        articles: [],
        // 时间戳,加载数据(页码)
        timestamp: Date.now()
      }))
    },
    async onLoad () {
      // // 获取数据 渲染列表
      // 注意：请勿模仿   真实的开发不需要的。
      await this.$sleep()
      // 当前选中的频道ID,时间戳
      // 动态获取当前频道的数据
      const data = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      // 给数据赋值  追加
      this.activeChannel.articles.push(...data.results)
      // 把加载中状态  加载结束
      this.activeChannel.upLoading = false
      // 如果数据加载完毕   pre_timestamp 值null  没有下一页
      if (!data.pre_timestamp) {
        this.activeChannel.finished = true
      } else {
        // 将来会继续加载
        this.activeChannel.timestamp = data.pre_timestamp
      }
    },
    async onRefresh () {
      console.log('wwwwwwwwwwwww')
      await this.$sleep()
      // 当前id和时间戳,刷新并且使用最新的时间戳
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      // 停止刷新
      this.activeChannel.downLoading = false
      if (data.results.length) {
        // 替换acticles数据
        this.activeChannel.acticles = data.results
        this.refreshSuccessText = '更新数据成功'
        // 把当前的时间戳,更换成后端给你的,获取下一页需要的数据
        this.activeChannel.timestamp = data.pre_timestamp
        // 把之前加载完毕的状态,更改成未加载完毕的状态
        this.activeChannel.finished = false
        // 防止数据加载不够,再次主动加载一次数据
        this.onLoad()
      } else {
        this.refreshSuccessText = '暂无更新'
      }
    }
  }
}
</script>
<style scoped lang='less'>
// 文章内容
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
