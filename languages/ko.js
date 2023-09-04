{
const _localTranslating = {
	webpage_title: `퍼즐앤드래곤 ${teamsCount} 명의 팀 다이어그램 작성 도구`,
	title_blank: "입력 제목",
	detail_blank: "입력 내용",
	force_reload_data: "데이터 강제 새로 고침",
	request_input: tp`${'info'}를 입력하십시오`,
	status_message: {
		loading_check_version: "데이터 버전을 확인 .",
		loading_mon_info: "몬스터 데이터를 로드 하 고 있습니다.",
		loading_skill_info: "기술 데이터를 로드 하 고 있습니다.",
		prepare_capture: "스크린 샷을 준비 하 고 있습니다.",
	},
	link_read_message: {
		success: tp`검색 ${'type'} 형식입니다. `,
		need_user_script: `PADDB는 도메인에 걸쳐 있으므로 이 기능을 지원하려면 사용자 스크립트 관리자 내에 보조 스크립트를 설치해야 합니다.`,
		user_script_link: `스크립트에 연결`,
		type: {
			"PADDF": "PADDF",
			"PDC": "PDC",
			"PADDB": "PADDB",
		},
		error: {
			0: "알 수 없는 오류입니다",
			1: "지원되지 않는 형식입니다." ,
			2: "팀 데이터가 없습니다." ,
			3: "잘못된 JSON 형식입니다." ,
			4: "잘못된 URL 형식입니다." ,
		},
		paddb_success: `작업이 성공했습니다`,
		paddb_unauthorized: `인증 실패(계정 번호 또는 잘못된 암호)`,
	},
	sort_name:{
		sort_none: "없음",
		sort_id: "카드 ID",
		sort_attrs : "속성",
		sort_evoRootId: "카드 진화 루트",
		sort_evoRoot_Attrs : "카드 진화 루트의 특성",
		sort_rarity: "래리티",
		sort_cost: "비용",
		sort_mp: "MP",
		sort_skillLv1: "최대 스킬 턴",
		sort_skillLvMax: "최소 스킬 턴",
		sort_evoSkillLastCD: "최소 스킬 턴 (최종 진화)",
		sort_hpMax120: "최대 HP",
		sort_atkMax120: "최대 공격",
		sort_rcvMax120: "최대 회복",
		sort_hpMax120_awoken: "최대 HP (+각성)",
		sort_atkMax120_awoken: "최대 공격 (+각성)",
		sort_rcvMax120_awoken: "최대 회복 (+각성)",
		sort_abilityIndex_awoken: "최대 가중 능력 지수 (+각성)",
	},
}
deepMerge(localTranslating, _localTranslating);
}
localisation(localTranslating);

//大数字缩短长度
Number.prototype.bigNumberToString = BigNumberToStringLocalise(['', '만', '억', '조', '경', '해', '자', '양', '구', '간', '정', '재', '극', '항하사', '아승기', '나유타', '불가사의', '무량대수'], 4);
