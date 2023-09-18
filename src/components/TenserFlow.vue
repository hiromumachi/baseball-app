<template>
  <v-container>
    <v-row align-content="center" >
      <v-col>
        <div>
          <h2>HOMEチーム</h2>
        </div>
        <v-select
          v-model="selectedHomeItem"
          :items="options"
          label="チームを選択"
        ></v-select>
        <div>
          <h2>HOMEチーム先発</h2>
        </div>
        <v-select
          v-model="selectedHomePitch"
          :items="homepitchers"
          label="先発を選択"
        ></v-select>
      </v-col>
      <v-col align="center" class="justify-center" >
        <h1>VS</h1>
      </v-col>
      <v-col>
        <div>
          <h2>AWAYチーム</h2>
        </div>
       
        <v-select
          v-model="selectedAwayItem"
          :items="options"
          label="チームを選択"
        ></v-select>
       
        <div>
          <h2>AWAYチーム先発</h2>
        </div>
        <v-select
          v-model="selectedAwayPitch"
          :items="awaypitchers"
          label="先発を選択"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
  <v-container align="center"  > 
      <v-btn 
      color="primary" 
      height="80" 
      width="160"
      v-on:click="predict"
      :disabled="!modelReady"
      >{{ buttonMessage }}</v-btn>
  </v-container>
 
  <v-container align="center">
       <h2>予想結果</h2>
  </v-container>
  <!-- 結果を表示するコンテナ -->
  <v-container align="center">
    <h1>{{ result }}</h1>
  </v-container>
</template>


<script>
import pitchersData from '../assets/pitcher_data.json'
import teamData from '../assets/teamdata.json'
import teamHit from '../assets/teamHit.json'
import teamPitch from '../assets/teamPitch.json'
 
import * as tf from '@tensorflow/tfjs';

import { createModel } from '../../public/app.js';

export default {
  data: () => ({
    selectedHomeItem: null,
    selectedAwayItem: null,
    selectedHomePitch: null,
    selectedAwayPitch: null,
    buttonMessage: 'モデル読み込み中...',
    options: [], 
    homepitchers: [],
    awaypitchers: [],
    result: 'win or lose',
    modelReady: false,

  }),
  watch: {
    selectedHomeItem: 'filterPitchers',
    selectedAwayItem: 'filterPitchers',
  },
  async mounted() {
    this.options = teamData
      .map((item) => item.pitcherteam);
    this.model= await createModel();
    this.modelReady = true;
    this.buttonMessage = '予測する';
    // async function loadModel() {
    //   this.model = await tf.loadLayersModel('../public/model.json');
    //   
    //   
    // }
    // loadModel();
  },
  methods: {
    
    filterPitchers() {
      if (this.selectedHomeItem != null) {
        // HOMEチームのselectedHomeItemが選択されている場合のフィルタリング
        this.homepitchers = pitchersData
          .filter((item) => item.Team_pitcher === this.selectedHomeItem)
          .map((item) => item.Name_pitcher);
      } else {
        this.homepitchers = []; // HOMEチーム未選択時は空にする
      }

      if (this.selectedAwayItem != null) {
        // AWAYチームのselectedAwayItemが選択されている場合のフィルタリング
        this.awaypitchers = pitchersData
          .filter((item) => item.Team_pitcher === this.selectedAwayItem)
          .map((item) => item.Name_pitcher);
      } else {
        this.awaypitchers = []; // AWAYチーム未選択時は空にする
      }
    },
    scale(value,mean,deviation) {
      return value.sub(mean).div(deviation);
    },
    unscale(value,mean,deviation) {
      return value.mul(deviation).add(mean);
    },
    preProcessInputs(inputs){
      let modelInput =tf.tensor1d(inputs)
      modelInput =this.scale(modelInput,)
    },
   async predict() {
      const dataset = this.getDataset();
   
      const inputData = tf.tensor2d([
        dataset
        ]);
        console.log(inputData);
      const prediction = this.model.predict(this.preProcessInputs(inputData));

      const result = await prediction.data(); // データを非同期で取得
     
      // 予測結果に応じて結果を設定
      if (result[0] > 0.5) {
        this.result = 'win';
      } else {  
        this.result = 'lose';
      }
    },
    normalizeInput(inputData) {
  // 各特徴量ごとの平均を計算
    const mean = inputData.mean(0);
    
    // 各特徴量ごとの標準偏差を計算
    const std = inputData.sub(mean).square().mean(0).sqrt();

    // 各特徴量の値から平均を引き、標準偏差で割って標準化
    const normalizedInputData = inputData.sub(mean).div(std);

    // 1の列を作成
    const ones = tf.ones([normalizedInputData.shape[0], 1]);

    // 1の列をデータに追加
    const inputDataWithOnes = tf.concat([ones, normalizedInputData], 1);

    console.log(inputDataWithOnes);

    return inputDataWithOnes;
    },
    getDataset() {
     const home=teamData.find((item) => item.pitcherteam === this.selectedHomeItem);
     const away=teamData.find((item) => item.pitcherteam === this.selectedAwayItem);
     const scrapingHome=home.scraping;
     const scrapingAway=away.scraping;

     const teamHomeHit=teamHit.find((item) => item.hit_TEAM === scrapingHome);
     const teamAwayHit=teamHit.find((item) => item.hit_TEAM === scrapingAway);

     const teamHomePitch=teamPitch.find((item) => item.pitch_TEAM === scrapingHome);
     const teamAwayPitch=teamPitch.find((item) => item.pitch_TEAM === scrapingAway);

    
     const fsPitcherHome=pitchersData.find((item) => item.Name_pitcher === this.selectedHomePitch);
     const fsPitcherAway=pitchersData.find((item) => item.Name_pitcher === this.selectedAwayPitch);

      const finalData = [fsPitcherAway.ERA_pitcher,fsPitcherAway.WHIP_pitcher,fsPitcherHome.ERA_pitcher,fsPitcherHome.WHIP_pitcher,teamHomeHit.hit_AVG,teamHomeHit.hit_OBP,teamHomeHit.hit_SLG,teamHomeHit.hit_OPS,teamHomePitch.pitch_ERA,
      teamHomePitch.pitch_WHIP,teamAwayHit.hit_AVG,teamAwayHit.hit_OBP,teamAwayHit.hit_SLG,teamAwayHit.hit_OPS,teamAwayPitch.pitch_ERA,
      teamAwayPitch.pitch_WHIP];
    
      const convertedArray = finalData.map((item) => parseFloat(item));
    
      return convertedArray;
      
    }
  },
};
</script>
