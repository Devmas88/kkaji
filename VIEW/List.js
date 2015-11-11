KkajiServer.List = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';

		var
		// list
		list,
		
		// wrapper
		wrapper = DIV({
			c : [
			
			// 글 작성 버튼
			A({
				c : '글 작성',
				on : {
					tap : function() {
						Kkaji.GO('form');
					}
				}
			}),
			
			// 글 목록
			list = UL()]
			
		}).appendTo(BODY),
		
		// dueDate watching room, 신규 데이터 감지 및 기존 데이터들을 불러오고 데이터의 변경을 감지하는 룸 생성
		dueDateWatchingRoom = Kkaji.DueDateModel.onNewAndFindWatching(function(dueDateData, addUpdateHandler, addRemoveHandler) {
			
			var
			// origin dueDate dom
			origindueDateDom,
			
			// dueDate dom
			dueDateDom;
			
			// 뷰가 열려있으면 내용 추가
			if (inner.checkIsClosed() !== true) {
				
				// 데이터가 수정된 경우 다시 DOM 생성
				addUpdateHandler(
					// function을 한번 실행하고 해당 function을 다시 반환한다.
					RAR(dueDateData, function(dueDateData) {
					
					origindueDateDom = dueDateDom;
					
					// 기존 DOM이 존재하면 기존 DOM 뒤에 새로운 DOM을 만들고 기존 DOM을 제거한다.
					// 기존 DOM이 존재하지 않으면 리스트의 맨 처음에 DOM을 만든다.
					(origindueDateDom === undefined ? list.prepend : origindueDateDom.after)(dueDateDom = LI({
						style : {
							backgroundColor : '#fff',
							margin : '0 auto',
							width : 200,
							padding : 10
						},
						c : [
						// 제목
						H3({
							style : {
								backgroundColor : '#828282',
								color : '#fff',
								width : '100%',
								height : 40
							},
							c : '제목 :' + dueDateData.title
						}),
						// 내용
						P({
							style : {
								backgroundColor : '#213123',
								color : '#fff',
								width : '100%',
								height : 100
							},
							c : dueDateData.content,
							on : {
								tap : function() {
									Kkaji.GO('detail/' + dueDateData.id);
								}
							}
						}),
						// 글 수정 버튼
						A({
							style : {
								color : '#333',
							},
							c : '글 수정',
							on : {
								tap : function() {
									Kkaji.GO('form/' + dueDateData.id);
								}
							}
						}),
						// 글 삭제 버튼
						A({
							style : {
								color : '#333',
							},
							style : {
								marginLeft : 5
							},
							c : '글 삭제',
							on : {
								tap : function() {
									Kkaji.dueDateModel.remove(dueDateData.id);
								}
							}
						})]
					}));
					
					if (origindueDateDom !== undefined) {
						origindueDateDom.remove();
					}
				}));
				
				// 데이터가 삭제된 경우 DOM 제거
				addRemoveHandler(function() {
					dueDateDom.remove();
				});
			}
		});
		
		// 뷰에서 나가면
		inner.on('close', function() {
			// wrapper 제거
			wrapper.remove();
			// dueDate 데이터의 변경을 감지하는 룸에서 나감
			dueDateWatchingRoom.exit();
		});
	}
});