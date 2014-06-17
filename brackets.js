(function(){

	var bf2js = {
		'[':'while(~~$$_[$]){',
		']':'}',
		'<':'--$;',
		'>':'++$;',
		'+':'$$_[$]=-~$$_[$];',
		'-':'$$_[$]=~-~~$$_[$];',
		'.':'__+=_$$(~~$$_[$]);',
		',':'$$_[$]=_._$$(~~[]);_=_.__$(-~{});'
	};

	var bf2bra = {
		'[':'[[[[]]]]',
		']':'[[[{}]]]',
		'<':'[]',
		'>':'{}',
		'+':'[[[]]]',
		'-':'[[{}]]',
		'.':'[[]]',
		',':'[{}]'
	};
	var bra2bf = {};
	var ins = Object.keys(bf2bra);
	for (var i = 0; i < ins.length; ++i) {
		bra2bf[bf2bra[ins[i]]] = ins[i];
		bf2bra[ins[i]] = '(' + bf2bra[ins[i]] + ')';
	}

	var transpile = function (code, key) {
		var newcode = '';
		while (code) { 
			newcode += key[code[0]] || ''; 
			code = code.substr(1); 
		}
		//console.log('Transpiled: ' + newcode);
		return newcode;
	};

	String.prototype._$$ = String.prototype.charCodeAt;
	String.prototype.__$ = String.prototype.substr; 
	var brainfuck = function (code, args){
		var _ = args;
		var __='';
		var $$_ = [];
		var $ = 0;
		var _$$ = String.fromCharCode;
		try {
			eval(transpile(code, bf2js));
			return __;
		} catch (e) {
			console.log(e);
			return null;
		}
	}
  
	var parse = function(input) {
		var n = 0, ni = input;
		while (ni instanceof Array) {
			ni = ni[0];
			n++;
		}
		return {
			n: n,
			endsInObject: ni !== undefined,
			str: input ? JSON.stringify(input) : ''
		};
	}, isEnd = function(input) {
		return !input.str;
	};
  
	Object.prototype[[]] = function(input) {
		return '({}[{}])' + transpile(input, bf2bra) + '()';
	};

	var toBrainfuck = function(input) {
		//console.log('Brackets: ' + input.map(function(i) { return '(' + i.str + ')'; }));
		var bf = '';
		while (input.length)
			bf += bra2bf[input.shift().str] || '';
		//console.log('Brainfuck: ' + bf);
		return bf;
	};

	Object.prototype[{}] = function(input) {

		var all = [parse(input)];
		if (isEnd(all[0]))
			return null;

		var next = function(input) {
			if (!input)
				return brainfuck(toBrainfuck(all), '');
			if (typeof(input) === 'string')
				return brainfuck(toBrainfuck(all), input);
			if (typeof(input) === 'function')
				return toBrainfuck(all);

			all.push(parse(input));
			return next;
		};

		return next;

	};

})();