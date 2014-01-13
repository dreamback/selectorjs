/**
 * jQuery拖拽 & 弹出层
 * API: http://dreamback.github.io/selectorjs/
 * @author: heshimeng1987@qq.com
 */
(function() {
		function removeMenus() {
			$('.m-select').removeClass('m-focus').find('dd').hide();
		};
		var SelectorJS = {
			//地区选择器
			area: {
				init: function(target, value, full) {
					SelectorJS.script('address.js', function(code) {
						this.code = code;
						this.target = $(target);
						this.dt = this.target.find('dt');
						this.dd = this.target.find('dd');
						this.tab = this.target.find('.tab');
						this.con = this.target.find('.tab-con');
						this.input = this.target.find('input');
						this.value = 'c' + value;
						this.full = full === undefined ? true : full; //true 三项

						var _value = [];
						if (/0{5}$/.test(this.value)) { //外国
							_value = ['外国', this.code['c10200000'][this.value].n];

						} else if (/0{2}$/.test(this.value) || !full) {
							_value = [this.code[this.value.replace(/\d{4}$/, '0000')].n,
								this.code[this.value.replace(/\d{4}$/, '0000')][this.value.replace(/\d{2}$/, '00')].n
							];
						} else {
							_value = this.code[this.value.replace(/\d{4}$/, '0000')].d ?
								[this.code[this.value.replace(/\d{4}$/, '0000')].n,
								this.code[this.value.replace(/\d{4}$/, '0000')][this.value].n
							] :
								[this.code[this.value.replace(/\d{4}$/, '0000')].n,
								this.code[this.value.replace(/\d{4}$/, '0000')][this.value.replace(/\d{2}$/, '00')].n,
								this.code[this.value.replace(/\d{4}$/, '0000')][this.value.replace(/\d{2}$/, '00')][this.value].n
							];
						}

						this.tab.html('<li>' + _value.join('</li><li>') + '</li>');
						this.dt.html(_value.join('-'));
						var res = [/0{5}$/.test(this.value) ? 'c10200000' : this.value.replace(/\d{4}$/, '0000'), this.value.replace(/\d{2}$/, '00'), this.value];
						var li = this.tab.find('li');
						li.last().addClass('on');
						li.each(function(i) {
							$(this).attr('val', res[i]);
						});
						this.create(li.size() > 2 ? this.code[res[0]][res[1]] : this.code[res[0]]);
						this.events();
					}, this);
				
				this.create = function(data) {
					var html = '';
					$.each(data, function(key, val) {
						if (key != 'n' && key != 'd') html += '<a title="' + this.n + '" href="javascript:;" val="' + key + '">' + this.n + '</a>';
					});
					this.con.html(html);
				};

				this.events = function() {
					var that = this;
					this.con.delegate('a', 'click', function(e) {
						e.stopPropagation();
						var on = that.tab.find('.on');
						on.nextAll().remove();
						var key = $(this).attr('val');
						var obj;
						var text = $(this).text();
						if (/000000$/.test(key)) {
							on.html(text).attr('val', key);
							that.setVal(key);
							return;
						}
						if (/0000$/.test(key)) {
							obj = that.code[key];
							that.create(obj);
							on.removeClass('on').html(text).attr('val', key);
							that.tab.append('<li class="on">请选择</li>');
						} else if (/\d00$/.test(key)) {
							if (that.code[key.replace(/\d\d00$/, '0000')].d != 1) {
								obj = that.code[key.replace(/\d\d00$/, '0000')][key];
								that.create(obj);
								on.removeClass('on').html(text).attr('val', key);
								if (that.full) {
									that.tab.append('<li class="on">请选择</li>');
								} else {
									that.setVal(key);
								}
							} else {
								on.html($(this).html()).attr('val', key);
								that.setVal(key);
							}
						} else {
							on.html($(this).html()).attr('val', key);
							that.setVal(key);
						}
					});

					this.tab.delegate('li', 'click', function(e) {
						e.stopPropagation();
						if ($(this).hasClass('on')) return;
						var key = $(this).attr('val');
						if (/0000$/.test(key)) {
							that.create(that.code);
						} else if (that.code[key.replace(/\d\d00$/, '0000')].d != 1) {
							that.create(that.code[key.replace(/\d\d00$/, '0000')]);
						}
						$(this).addClass('on').siblings().removeClass('on');
						$(this).nextAll().remove();
					});
					$(document).unbind('click', removeMenus)
						.bind('click', removeMenus);
					this.target.bind('click', function(e) {
						removeMenus();
						e.stopPropagation();
						that.dd.show();
						that.target.addClass('m-focus');
					});
				};

				this.setVal = function(key) {
					this.input.val(key.replace('c', ''));
					var text = [];
					this.tab.find('li').each(function() {
						text.push($(this).text());
					});
					this.dt.html(text.join('-'));
					this.dd.hide();
					this.target.removeClass('m-focus');
				}
			}
		},
			age: function(age0, age1, val0, val1) {
				function getAgeHTML(start) {
					start = start || 18;
					start = start > 80 ? 80 : start;
					var result = '',
						i = start;
					for (; i <= 80; i++) {
						result += '<a' + (i == start && start < 68 ? ' style="margin-left:' + ((i % 10 ? i % 10 : 1) - 1) * 40 + 'px"' : '') + ' href="javascript:;" val="' + i + '">' + i + '</a>';
					}
					return result;
				}
				new SelectorJS.selector.init({
					id: age0,
					data: getAgeHTML(),
					value: val0,
					click: function(value) {
						var prev = $('dt', age1).html() | 0;
						var form = new SelectorJS.selector.init({
							id: age1,
							value: value >= prev ? value : prev,
							data: getAgeHTML(value + 1)
						});
						if (value >= prev) {
							form.curValue.html(value + 1 < 81 ? value + 1 : 80)
						}
						form.curValue.click();
					}
				}).curValue.html(val0);
				new SelectorJS.selector.init({
					id: age1,
					value: val1,
					data: getAgeHTML(val0 + 1)
				}).curValue.html(val1);
			},
			heightMulti: function(h0, h1, val0, val1) {
				function getAgeHTML(start) {
					start = start || 129;
					start = start > 211 ? 211 : start;
					var result = '',
						i = start;
					for (; i <= 211; i++) {
						result += '<a' + (i == start && start < 190 ? ' style="margin-left:' + ((i % 10 ? i % 10 : 1) - 1) * 40 + 'px"' : '') + ' href="javascript:;" val="' + i + '">' + i + '</a>';
					}
					return result;
				}
				new SelectorJS.selector.init({
					id: h0,
					data: getAgeHTML(),
					value: val0,
					click: function(value) {
						var prev = $('dt', h1).html() | 0;
						var form = new SelectorJS.selector.init({
							id: h1,
							value: value >= prev ? value : prev,
							data: getAgeHTML(value + 1)
						});
						if (value >= prev) {
							form.curValue.html(value + 1 < 211 ? value + 1 : 211)
						}
						form.curValue.click();
					}
				}).curValue.html(val0);
				new SelectorJS.selector.init({
					id: h1,
					value: val1,
					data: getAgeHTML(val0 + 1)
				}).curValue.html(val1);
			},
			selector: {
				init: function(options) {
					this.select = $(options.id);
					this.data = options.data;
					this.value = options.value;
					this.height = options.height;
					this.width = options.width;
					this.curValue = this.select.find('dt');
					this.list = this.select.find('dd');
					this.input = this.select.find('input');
					this.click = options.click;

					this.height && this.list.css({
						height: this.height,
						overflowY: 'auto'
					});
					this.width && this.select.css({
						width: this.width
					});

					this.create = function() {
						var listHTML = '',
							that = this;
						if (typeof this.data !== 'string') {
							$.each(this.data, function(index, val) {
								if (val[0] == that.value) {
									that.input.val(val[0]);
									that.curValue.html(val[1]);
								}
								listHTML += '<a val="' + val[0] + '" href="javascript:;">' + val[1] + '</a>';
							});
						} else {
							listHTML = this.data;
						}
						this.list.children().not('input').remove();
						this.list.append(listHTML);
						if (this.data !== 'string') {
							//that.input.val(this.value);
							//that.curValue.html(this.value);
						}
					},
					this.events = function() {
						var that = this;
						this.list.find('a').bind('click', function(e) {
							e.stopPropagation();
							that.input.val($(this).attr('val'));
							that.curValue.html($(this).text());
							that.list.hide();
							that.select.removeClass('m-focus');
							that.click && that.click.call(this, $(this).attr('val') | 0, $(this).index());
						});
						$(document).unbind('click', removeMenus)
							.bind('click', removeMenus);
						this.select.bind('click', function(e) {
							e.stopPropagation();
							removeMenus();
							that.list.show();
							that.select.addClass('m-focus');
						});
					}

					this.create();
					this.events();
				}
			},
			script: function(src, callback, that) {
				var script = document.getElementsByTagName('script'),
					i = 0,
					len = script.length;
				for (; i < len; i++) {
					if (/Selector.js/.test(script[i].src)) {
						$.getScript(script[i].src.replace('Selector.js', src), function() {
							callback.call(that, addressCode);
						});
						break;
					}
				}
			}
	}; window.SelectorJS = SelectorJS;
})();