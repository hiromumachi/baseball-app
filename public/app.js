// Load our saved model from current directory (which will be
// hosted via Firebase Hosting)

export async function createModel(){
  const model = await tf.loadLayersModel('model.json');
  return model;
}
// async function prediction(model) {
  
//   console.log('prediction');
//   const inputData = tf.tensor2d([
//       [
//       3.79,	1.23,	3.79	,1.10,	0.238,	0.318	,0.381,	0.699	,3.81,	1.18	,0.254	,0.328	,0.419	,0.747	,4.05	,1.27	
//       ]
//     ]);
//   const prediction = model.predict(normalizeInput(inputData));

//   const result = await prediction.data(); // データを非同期で取得

//   // 予測結果に応じて結果を設定
//   if (result[0] > 0.5) {
//     console.log('win');
//   } else {  
//     console.log('lose');
//   }
// }

// function normalizeInput(inputData) {
//   // 各特徴量ごとの平均を計算
//     const mean = inputData.mean(0);
    
//     // 各特徴量ごとの標準偏差を計算
//     const std = inputData.sub(mean).square().mean(0).sqrt();

//     // 各特徴量の値から平均を引き、標準偏差で割って標準化
//     const normalizedInputData = inputData.sub(mean).div(std);

//     // 1の列を作成
//     const ones = tf.ones([normalizedInputData.shape[0], 1]);

//     // 1の列をデータに追加
//     const inputDataWithOnes = tf.concat([ones, normalizedInputData], 1);

//     return inputDataWithOnes;
// }

// prediction();
createModel()