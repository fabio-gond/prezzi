// JavaScript Document

var costoTotale=0;
var costoCarta=0;
var costoStampa=0;
var costoMateriali=0;
var costoLavorazioni=0; // Costo altre lavorazioni
var hStampa=1; // Altezza della stampa in cm (compresi bordi)
var wStampa=3; // Larghezza della stampa in cm (compresi bordi)
//var areaStampa=hStampa*wStampa/10000; // Area della stampa in m2 (compresi bordi)
var costoOrario=15; // Costo in euro per un ora di lavoro di un lavoratore
var qtaProdotti=100; // Quantità di prodotti finali

var coloriStampa=2; // Qta di colori che verranno stampati


// ------------------------------   DEFINIZIONE CARTE, STAMPANTI ---  //
function carta (type, grammatura, width, height, costoFoglio){
	this.type=type;
	this.grammatura=grammatura;
	this.width=width;
	this.height=height;
	this.costoFoglio=costoFoglio;
}
var carte = [];
carte.patLucida_64x88_170=new carta("patLucida",170,64,88,0.005); 


function stampante (width, height, colors){
	this.width=width;
	this.height=height;
	this.colors=colors;
}
var stampanti=[];
stampanti.gto=new stampante(32,46,1);
//stampanti.gto2=new stampante(36,52,2);
//stampanti.grande=new stampante(50,70,1);

// --------------------------------------------------------------


// --------------- Nuova Prova -----------------

/*
	Calcola quante copie del prodotto possono stare nel foglio
	@return copie: 
		ww,hh,wh,hw = quante copie dividendo larghezza foglio per larghezza stampa e così via ;  
		WwHh = quante ci stanno mettendo il foglio e stampa in orizzontale;
		WwHh = quante ci stanno mettendo la stampa in verticale;
*/
function contaCopie (wFoglio,hFoglio,wStampa,hStampa){
	var copie=[];
	copie.ww=0;copie.wh=0;copie.hh=0;copie.hw=0;copie.WwHh=0;copie.WhHw=0;
	if (hFoglio>= hStampa && wFoglio>=wStampa){
		copie.ww=Math.floor(wFoglio / wStampa);
		copie.hh=Math.floor(hFoglio / hStampa);
		copie.WwHh = copie.ww * copie.hh;
	}
	if (hFoglio>= wStampa && wFoglio>=hStampa){
		copie.wh=Math.floor(wFoglio / hStampa);
		copie.hw=Math.floor(hFoglio / wStampa);
		copie.WhHw = copie.wh * copie.hw;
	}
	return copie;
}

/*
	Calcola se il foglio in questa posizione passa nella stampante
	@return n: non passa; w:passa in orizzontale; h:passa in verticale; 
*/
function staDentro (wFoglio,hFoglio,wStampa,hStampa){
	if (hFoglio>= hStampa && wFoglio>=wStampa)return true;
	return false;
}

/*
	Prova a dividere il foglio in modo da far uscire più prodotti possibile tagliando il foglio in meno parti possibile e controllando che ci stia nella stampante.
*/
function scegliCarta (){
	"use strict";
	var costoProdotto=1000; // Costo della carta nell'area occupata dal prodotto
	var tipoCarta="";
	for (var nomeCarta in carte) {
		var carta= carte[nomeCarta]; 
		var costoFoglio= carta.costoFoglio;
		var wFoglio= 2.2; //carta.width; // dimensioni della carta in cm
		var hFoglio= 6;//carta.height; // dimensioni della carta in cm
		for (var nomeStampante in stampanti) {
			var stampante= stampanti[nomeStampante];
			var wStampante = 5//stampante.width;
			var hStampante = 2//stampante.height;
			wStampa=2.5;
			hStampa=2;

			var copie=contaCopie(wFoglio,hFoglio,wStampa,hStampa);
			var maxCopie= Math.max(copie.WwHh,copie.WhHw);


			var exit=false; var i=1; var y=1;
			var hCorr=hFoglio;
			var wCorr=wFoglio;
			var copieCorr=[];
			while (!exit){
				var exit1=false;
				y=1;
				while (!exit1 && !exit){
					hCorr=hFoglio/y;
					wCorr= wFoglio/i;
					//alert (hCorr + "-" +wCorr);
					copieCorr=contaCopie(wCorr,hCorr,wStampa,hStampa);
					
					var copieTotWwHh=copieCorr.WwHh*i*y; // Quante copie in totale verrebbero per foglio
					var copieTotWhHw= copieCorr.WhHw*i*y; // Quante copie in totale verrebbero per foglio
					
					/* Se vengono fuori tante copie del prodotto quante sono il massimo che ne possono uscire
					   Controllo se il foglio diviso in questo modo sta nelle dimensioni per la stampante.
					ELSE
						Guardo se è possibile restringere un pò il foglio cosi ritagliato per farlo passare nella stampante e farne uscire lo stesso numero di copie.
					*/
					if (copieTotWwHh==maxCopie){
						if (staDentro(wStampante,hStampante,wCorr,hCorr) ){ // Ci passa in orizzontale?
							exit=true;
						}else{
							if (wCorr>wStampante && wStampante>=copie.ww*wStampa){ 
								wCorr=wStampante;
							}
							if (hCorr>hStampante && hStampante>=copie.hh*hStampa){
								hCorr=hStampante;
							}
							if (staDentro(wStampante,hStampante,wCorr,hCorr) )alert ("A" + wCorr + "-" +hCorr +" | Divisioni: " + i +"-" + y);
						}
						
						if (staDentro(hStampante,wStampante,wCorr,hCorr) ){ // Ci passa con stampante in verticale?
							exit=true;
						}{
							if (wCorr>hStampante && hStampante>=copie.ww*wStampa){ 
								wCorr=hStampante;
							}
							if (hCorr>wStampante && wStampante>=copie.hh*hStampa){
								hCorr=wStampante;
							}
							if (staDentro(wStampante,hStampante,hCorr,wCorr) )alert ("B" + wCorr + "-" +hCorr +" | Divisioni: " + i +"-" + y);
						}
					}
					
					if(copieTotWhHw==maxCopie){
						if (staDentro(wStampante,hStampante,wCorr,hCorr) ){ // Ci passa in orizzontale?
							exit=true;
						}else{
							if (wCorr>wStampante && wStampante>=copie.wh*hStampa){ 
								wCorr=wStampante;
							}
							if (hCorr>hStampante && hStampante>=copie.hw*wStampa){
								hCorr=hStampante;
							}
							if (staDentro(wStampante,hStampante,wCorr,hCorr) )alert ("C" + wCorr + "-" +hCorr +" | Divisioni: " + i +"-" + y);
						}
						
						if (staDentro(hStampante,wStampante,wCorr,hCorr) ){ // Ci passa con stampante in verticale?
							exit=true;
						}{
							if (wCorr>hStampante && hStampante>=copie.wh*hStampa){ 
								wCorr=hStampante;
							}
							if (hCorr>wStampante && wStampante>=copie.hw*wStampa){
								hCorr=wStampante;
							}
							if (staDentro(wStampante,hStampante,hCorr,wCorr) )alert ("D" + wCorr + "-" +hCorr +" | Divisioni: " + i +"-" + y);
						}
					}
					//alert (t + "-" + t1);
					if (t==0 && t1==0)exit1=true;
					y++;
				}
				i++;
			}
			alert (nomeStampante + "\nDimensione carta tagliata: " + hCorr + "-" +wCorr +"\n" + "Copie su carta tagliata: " + copieCorr[0] +"-" +copieCorr[1]);	
		}
		//var costoTemp = costoFoglio/Math.max(dim,dim1);
		//tipoCarta= costoTemp<costoProdotto? carta[0]:tipoCarta;
		//costoProdotto= costoTemp<costoProdotto? costoTemp : costoProdotto;
	};
	return [tipoCarta,costoProdotto * qtaProdotti];
}

var cartaScelta = scegliCarta();
// ----------------------------------------------



/* ---------- Calcolo Costo Stampa ------------


// Cerco le combinazioni tra le carte e le dimensioni massime di stampa di ogni stampante
for (var nomeCarta in carte) {
	var carta= carte[nomeCarta];
	var costoFoglio= carta.costoFoglio;
	var hFoglio= carta.height; // dimensioni della carta in cm
	var wFoglio= carta.width; // dimensioni della carta in cm
	
	for (var nomeStampante in stampanti) {
		var stampante= stampanti[nomeStampante];
		var hStampante=stampante.height; // altezza max di stampa
		var wStampante=stampante.width; // larghezza max di stampa
		var colors=stampante.colors;
		var passaggiWwHh=0; // passaggi di stampa dividendo w/w h/h
		var dimWwHh;	// dim foglio ritagliato dividendo w/w h/h
		var passaggiWhHw=0; // passaggi di stampa dividendo w/h h/w
		var dimWhHw;	// dim foglio ritagliato dividendo w/h h/w
		
		if (hFoglio>= hStampante && wFoglio>=wStampante){
			passaggiWwHh =Math.ceil(hFoglio / hStampante) * Math.ceil(wFoglio / wStampante);
			dimWwHh= [hFoglio/Math.ceil(hFoglio / hStampante),wFoglio/Math.ceil(wFoglio / wStampante)];
		}
		if (hFoglio>= wStampante && wFoglio>=hStampante){
			passaggiWhHw =Math.ceil(hFoglio / wStampante) * Math.ceil(wFoglio / hStampante);
			dimWhHw = [hFoglio/Math.ceil(hFoglio / wStampante),wFoglio/Math.ceil(wFoglio / hStampante)];
		}
		
		//alert (nomeCarta + " su " + nomeStampante + " = " + dimWwHh[0] + "-" + dimWwHh[1]);
	};
	
};


// -------------------------------------------- */


costoTotale=costoCarta+costoLavorazioni+costoMateriali+costoStampa;
