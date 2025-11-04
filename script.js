var daLinguagem = document.getElementById("daLinguagem");
var praLinguagem = document.getElementById("praLinguagem");
var inputCode = document.getElementById("inputCode");
var outputCode = document.getElementById("outputCode");
var converterBtn = document.getElementById("converterBtn");
var trocarBtn = document.getElementById("trocarBtn");
var copiarEntradaBtn = document.getElementById("copiarEntradaBtn");
var limparEntradaBtn = document.getElementById("limparEntradaBtn");
var copiarSaidaBtn = document.getElementById("copiarSaidaBtn");
var limparSaidaBtn = document.getElementById("limparSaidaBtn");
var colarBtn = document.getElementById("colarBtn");
var toast = document.getElementById("toast");

function mostrarToast(texto){
  toast.textContent = texto;
  toast.classList.add("mostrar");
  setTimeout(function(){
    toast.classList.remove("mostrar");
  }, 2200);
}

function normalizarFimLinha(txt){
  return txt.replace(/\r\n/g, "\n");
}

function converter(){
  var origem = daLinguagem.value;
  var destino = praLinguagem.value;
  var texto = normalizarFimLinha(inputCode.value || "");

  if(!texto.trim()){
    outputCode.value = "";
    mostrarToast("Cole um código para converter");
    return;
  }
  if(origem === destino){
    outputCode.value = texto;
    mostrarToast("Mesma linguagem: conteúdo copiado");
    return;
  }

  converterBtn.disabled = true;
  converterBtn.style.setProperty("--ang", "0deg");
  var ang = 0;
  var spin = setInterval(function(){
    ang = ang + 10;
    converterBtn.style.setProperty("--ang", ang + "deg");
  }, 16);

  setTimeout(function(){
    clearInterval(spin);
    converterBtn.disabled = false;
    var chave = origem + "->" + destino;
    var resultado;

    if(Conversores[chave]){
      resultado = Conversores[chave](texto);
    }else if((origem==="CSS" && destino==="SCSS") || (origem==="SCSS" && destino==="CSS")){
      mostrarToast("Conversão direta entre estilos");
      resultado = texto;
    }else{
      mostrarToast("ERRO: Linguagens com propostas diferentes");
      resultado = texto;
    }

    outputCode.value = resultado;
  }, 500);
}

var Conversores = {
  "TypeScript->JavaScript": function(txt){ return tsParaJs(txt); },
  "JavaScript->TypeScript": function(txt){ return jsParaTs(txt); },
  "JavaScript->Python": function(txt){ return jsParaPy(txt); },
  "Python->JavaScript": function(txt){ return pyParaJs(txt); },
  "JavaScript->PHP": function(txt){ return jsParaPhp(txt); },
  "PHP->JavaScript": function(txt){ return phpParaJs(txt); },
  "JavaScript->Java": function(txt){ return jsParaJava(txt); }
};

function jsParaPy(txt){
  var r = txt;
  r = r.replace(/\bconst\b|\blet\b|\bvar\b/g, "");
  r = r.replace(/console\.log\s*\((.*?)\)\s*;?/g, "print($1)");
  r = r.replace(/===/g, "==");
  r = r.replace(/!==/g, "!=");
  r = r.replace(/;\s*$/gm, "");
  r = r.replace(/\{[\t ]*\n?/g, ": ");
  r = r.replace(/\}[\t ]*\n?/g, "\n");
  r = r.replace(/\btrue\b/g, "True").replace(/\bfalse\b/g, "False").replace(/\bnull\b/g, "None");
  r = r.replace(/function\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:/g, "def $1($2):");
  r = r.replace(/function\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*\{/g, "def $1($2):");
  r = r.replace(/=>\s*\{/g, ":");
  r = r.replace(/=>\s*([^\n\r;]+)/g, ":\n    return $1");
  r = r.replace(/for\s*\(\s*let\s+([a-zA-Z_]\w*)\s*=\s*(\d+)\s*;\s*\1\s*<\s*([a-zA-Z_]\w*|\d+)\s*;\s*\1\+\+\s*\)\s*\{/g, "for $1 in range($2, $3):");
  r = r.replace(/if\s*\((.*?)\)\s*:/g, "if $1:");
  r = r.replace(/if\s*\((.*?)\)\s*\{/g, "if $1:");
  r = r.replace(/else\s*\{/g, "else:");
  r = r.replace(/\)\s*:/g, "):");
  var linhas = r.split("\n");
  var i;
  for(i=0;i<linhas.length;i++){
    linhas[i] = linhas[i].replace(/^\s+/, "");
  }
  r = linhas.join("\n");
  return r;
}

function pyParaJs(txt){
  var r = txt;
  r = r.replace(/print\((.*?)\)\s*$/gm, "console.log($1);");
  r = r.replace(/def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:/g, "function $1($2) {");
  r = r.replace(/^\s*return\s+(.*)$/gm, "  return $1");
  r = r.replace(/^\s*(if|elif)\s+(.*):\s*$/gm, "if ($2) {");
  r = r.replace(/^\s*else:\s*$/gm, "else {");
  r = r.replace(/^\s*for\s+([a-zA-Z_]\w*)\s+in\s+range\((\d+)\s*,\s*(\d+)\):\s*$/gm, "for (let $1 = $2; $1 < $3; $1++) {");
  r = r.replace(/^\s*for\s+([a-zA-Z_]\w*)\s+in\s+(.*):\s*$/gm, "$2.forEach(($1) => {");
  r = r.replace(/^\s*([^\n]+)\s*#.*$/gm, "$1");
  r = r.replace(/^\s*$/gm, "");
  r = r.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null");
  r = r.replace(/^(.*[^}])$/gm, function(m){
    var t = m.trim();
    if(t==="" || t.charAt(t.length-1)==="{" || t.charAt(t.length-1)==="}"){
      return m;
    } else {
      return m + ";";
    }
  });
  if(r.indexOf("{") !== -1){
    var rt = r.trim();
    if(rt.charAt(rt.length-1) !== "}"){
      r = r + "\n}";
    }
  }
  return r;
}

function jsParaPhp(txt){
  var r = txt;
  r = r.replace(/\bconst\b|\blet\b|\bvar\b/g, "$");
  r = r.replace(/\$([a-zA-Z_]\w*)\s*=\s*/g, "$$$1 = ");
  r = r.replace(/console\.log\s*\((.*?)\)\s*;?/g, "echo $1;");
  r = r.replace(/\btrue\b/g, "true").replace(/\bfalse\b/g, "false").replace(/\bnull\b/g, "null");
  r = r.replace(/function\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*\{/g, "function $1($2) {");
  r = r.replace(/=>\s*\{/g, "{");
  r = r.replace(/===/g, "===").replace(/!==/g, "!==");
  r = "<?php\n" + r + "\n?>";
  return r;
}

function phpParaJs(txt){
  var r = txt;
  r = r.replace(/<\?php|\?>/g, "");
  r = r.replace(/\$([a-zA-Z_]\w*)/g, "let $1");
  r = r.replace(/let\s+([a-zA-Z_]\w*)\s*=\s*/g, "let $1 = ");
  r = r.replace(/echo\s+(.*?);/g, "console.log($1);");
  r = r.replace(/function\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*\{/g, "function $1($2) {");
  return r;
}

function jsParaJava(txt){
  var r = txt;
  r = r.replace(/console\.log\s*\((.*?)\)\s*;?/g, "System.out.println($1);");
  r = r.replace(/\btrue\b/g, "true").replace(/\bfalse\b/g, "false").replace(/\bnull\b/g, "null");
  r = r.replace(/let\s+([a-zA-Z_]\w*)\s*=\s*("[^"]*"|'[^']*');/g, "String $1 = $2;");
  r = r.replace(/const\s+([a-zA-Z_]\w*)\s*=\s*("[^"]*"|'[^']*');/g, "final String $1 = $2;");
  r = r.replace(/(?:let|const|var)\s+([a-zA-Z_]\w*)\s*=\s*(\d+);/g, "int $1 = $2;");
  r = r.replace(/function\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*\{/g, "static Object $1($2) {");
  r = r.replace(/=>\s*\{/g, "{");
  r = envolverEmClasseJava(r);
  return r;
}

function envolverEmClasseJava(corpo){
  var temClasse = /\bclass\s+[A-Za-z_]\w*/.test(corpo);
  if(temClasse){ return corpo; }

  var linhas = corpo.split("\n");
  var i, corpoIndentado = "";
  for(i=0;i<linhas.length;i++){
    corpoIndentado += "  " + linhas[i] + "\n";
  }

  var base = ""
    + "public class Conversao {\n"
    + "  public static void main(String[] args) {\n"
    + "    System.out.println(\"Exemplo de saída\");\n"
    + "  }\n"
    + corpoIndentado
    + "}";
  return base;
}

function tsParaJs(txt){
  var r = txt;
  r = r.replace(/:\s*[A-Za-z_<>\[\]\|\&\?\s]+(?=(\)|,|;|=|\s))/g, "");
  r = r.replace(/<\s*[A-Za-z_<>\[\]\|\&\?\s]+>/g, "");
  r = r.replace(/interface\s+[A-Za-z_]\w*[\s\S]*?\}/g, "");
  r = r.replace(/type\s+[A-Za-z_]\w*\s*=\s*[^;]+;/g, "");
  r = r.replace(/as\s+[A-Za-z_<>\[\]\|\&\?\s]+/g, "");
  r = r.replace(/!\./g, ".");
  r = r.replace(/!\b/g, "");
  return r;
}

function jsParaTs(txt){
  var r = txt;
  r = r.replace(/\bconst\b/g, "const");
  r = r.replace(/\blet\s+([a-zA-Z_]\w*)\s*=\s*(\d+)(\s*;?)/g, "let $1: number = $2$3");
  r = r.replace(/\blet\s+([a-zA-Z_]\w*)\s*=\s*("[^"]*"|'[^']*')(\s*;?)/g, "let $1: string = $2$3");
  r = r.replace(/\bfunction\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*\{/g, "function $1($2): any {");
  return r;
}

function copiarTexto(el){
  var v = el.value || "";
  if(!v){
    mostrarToast("Nada para copiar");
    return;
  }
  if(!navigator.clipboard){
    mostrarToast("Permita acesso à área de transferência");
    return;
  }
  navigator.clipboard.writeText(v).then(function(){
    mostrarToast("Copiado");
  });
}

function colarNo(el){
  if(!navigator.clipboard){
    mostrarToast("Permita acesso à área de transferência");
    return;
  }
  navigator.clipboard.readText().then(function(t){
    el.value = t;
  });
}

converterBtn.addEventListener("click", function(){ converter(); });

trocarBtn.addEventListener("click", function(){
  var a = daLinguagem.value;
  daLinguagem.value = praLinguagem.value;
  praLinguagem.value = a;

  var t = inputCode.value;
  inputCode.value = outputCode.value;
  outputCode.value = t;
});

copiarEntradaBtn.addEventListener("click", function(){ copiarTexto(inputCode); });
copiarSaidaBtn.addEventListener("click", function(){ copiarTexto(outputCode); });
limparEntradaBtn.addEventListener("click", function(){ inputCode.value = ""; });
limparSaidaBtn.addEventListener("click", function(){ outputCode.value = ""; });
colarBtn.addEventListener("click", function(){ colarNo(inputCode); });33