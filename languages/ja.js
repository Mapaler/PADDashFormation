{
const _localTranslating = {
	webpage_title: `パズル＆ドラゴンズ${teamsCount}人のチーム図作成ツール`,
	title_blank: "入力タイトル",
	detail_blank: "入力詳細",
	force_reload_data: "データの強制更新",
	request_input: tp`${'info'}を入力してください`,
	status_message: {
		loading_check_version: "データバージョンをチェックしています。",
		loading_mon_info: "モンスターデータを読み込んでいます。",
		loading_skill_info: "スキル データを読み込んでいます。",
		prepare_capture: "スクリーンショットを準備しています。",
	},
	active_skill_title: "スキル",
	evolved_skill_title: "進化スキル",
	leader_skill_title: "リーダースキル",
	link_read_message: {
		success: tp`発見 ${'type'} 形式.`,
		need_user_script: `PADDB はドメイン間であるため、この機能をサポートするには、ユーザー スクリプト マネージャ内にセカンダリ スクリプトをインストールする必要があります。`,
		user_script_link: `スクリプトへのリンク`,
		type: {
			"PADDF": "PADDF",
			"PDC": "PDC",
			"PADDB": "PADDB",
		},
		error: {
			0: "不明なエラーです",
			1: "サポートされていない形式。" ,
			2: "チームデータがありません" ,
			3: "間違った JSON 形式です。" ,
			4: "間違った URL 形式です。 ",
		},
		paddb_success: `操作は成功`,
		paddb_unauthorized: `認証に失敗しました (アカウントまたはパスワードが正しくありません)`,
	},
	sort_name:{
		sort_none: "いいえ",
		sort_id: "カード ID",
		sort_attrs : "属性",
		sort_evoRootId: "カード進化ルート",
		sort_evoRoot_Attrs : "カード進化ルートの属性",
		sort_rarity: "レアリティ",
		sort_cost: "コスト",
		sort_mp: "MP",
		sort_skillLv1: "最大スキルターン",
		sort_skillLvMax: "最小スキルターン",
		sort_skillLvMax: "最小スキルターン (最終的な進化)",
		sort_hpMax120: "最大 HP",
		sort_atkMax120: "最大攻撃",
		sort_rcvMax120: "最大回復",
		sort_hpMax120_awoken: "最大 HP (+覚醒)",
		sort_atkMax120_awoken: "最大攻撃 (+覚醒)",
		sort_rcvMax120_awoken: "最大回復 (+覚醒)",
		sort_abilityIndex_awoken: "最大加重能力指数 (+覚醒)",
	},
}
deepMerge(localTranslating, _localTranslating);
}
localisation(localTranslating);

//大数字缩短长度
Number.prototype.bigNumberToString = BigNumberToStringLocalise(['', '万', '億', '兆', '京', '垓', '𥝱', '穣', '溝', '澗', '正', '載', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'], 4);
