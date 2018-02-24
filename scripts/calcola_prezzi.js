// JavaScript Document

var costoTotale=0;
var costoCarta=0;
var costoStampa=0;
var costoMateriali=0;
var costoLavorazioni=0; // Costo altre lavorazioni
var hStampa=1; // Altezza della stampa in cm (compresi bordi)
var wStampa=3; // Larghezza della stampa in cm (compresi bordi)
//var areaStampa=hStampa*wStampa/10000; // Area della stampa in m2 (compresi bordi)
var costoOrario=13; // Costo in euro per un ora di lavoro di un lavoratore
var qtaProdotti=10000; // Quantità di prodotti finali

var coloriStampa=4; // Qta di colori che verranno stampati


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
carte.patLucida_70x100_170=new carta("patLucida",170,70,100,0.006); 


function stampante (width, height, passaggiOra, colors){
	this.width=width;
	this.height=height;
	this.colors=colors;
	this.passaggiOra=passaggiOra;
}
var stampanti=[];
stampanti.gto=new stampante(32,46,1000,1);
//stampanti.gto2=new stampante(36,52,1000,2);
//stampanti.grande=new stampante(50,70,1000,1);

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
*/
function staDentro (wFoglio,hFoglio,wStampa,hStampa){
	if (hFoglio>= hStampa && wFoglio>=wStampa)return true;
	return false;
}

// Calcola Costo Stampa 

function calcolaStampa (stampante,copiePerFoglio){
	var passaggi=Math.ceil(qtaProdotti/copiePerFoglio);
	var tempoStampa= (passaggi/stampante.passaggiOra) * Math.ceil(coloriStampa/stampante.colors);
	var avviamento1Col= 15/60; // Tempo per avviamento 1col in ore
	var avviamento2Col= 40/60; // Tempo per avviamento 2col in ore
	var cambio1Col=20/60; // Tempo per cambiare un colore e rifare avviamento
	var cambio2Col=35/60; // Tempo per cambiare un colore e rifare avviamento
	var avviamento=avviamento1Col;;
	var cambi1col=0; var cambi2col=0;
	
	if(coloriStampa>=2){
		if (stampante.colors==1){
			cambi1col=coloriStampa-1;
		} else {
			avviamento=avviamento2Col;
			cambi2col=Math.floor((coloriStampa-2)/2); 
			cambi1col=Math.floor((coloriStampa-2)%2); 
		}
	}
	var tempoTot= avviamento + tempoStampa + cambi1col * cambio1Col + cambi2col * cambio2Col;
	return tempoTot; // * costoOrario;
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
		var wFoglio= carta.width; // dimensioni della carta in cm
		var hFoglio= carta.height; // dimensioni della carta in cm
		for (var nomeStampante in stampanti) {
			var stampante= stampanti[nomeStampante];
			var wStampante = stampante.width;
			var hStampante = stampante.height;
			wStampa=21;
			hStampa=29.7;

			var copie=contaCopie(wFoglio,hFoglio,wStampa,hStampa);
			var maxCopie= Math.max(copie.WwHh,copie.WhHw); // Massimo numero di copie che possono uscire dal foglio


			var exit=false; var i=0; var y=0;
			var hCorr=hFoglio;
			var wCorr=wFoglio;
			var copieCorr=[];
			while (!exit){  // Ciclo per divisioni su h
				var exit1=false;
				y=0;
				i++;
				while (!exit1 && !exit){ // Ciclo per divisioni su w
					y++;
					hCorr=hFoglio/y;
					wCorr= wFoglio/i;
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
							if (staDentro(wStampante,hStampante,wCorr,hCorr) )exit=true;
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
							if (staDentro(wStampante,hStampante,hCorr,wCorr) )exit=true;
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
							if (staDentro(wStampante,hStampante,wCorr,hCorr) )exit=true;
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
							if (staDentro(wStampante,hStampante,hCorr,wCorr) )exit=true;
						}
					}
					//alert (t + "-" + t1);
					if (!staDentro(wCorr,hCorr,wStampa,hStampa))exit1=true;
				}
			}
			var copiePerFoglio=Math.max(copieCorr.WwHh,copieCorr.WhHw);
			alert (nomeCarta +"-" +nomeStampante + "\nDimensione carta tagliata: " + hCorr + "-" +wCorr +"\nTagliare in " + i + " parti in orizzontale e in " + y + " parti in verticale" + "\nCopie su carta tagliata: " + Math.max(copieCorr.WwHh,copieCorr.WhHw));
			alert (nomeCarta +"-" +nomeStampante + "\nCosto carta: " + Math.ceil(qtaProdotti/maxCopie)*carta.costoFoglio + "\nTempo Stampa: " + calcolaStampa(stampante,copiePerFoglio))
		}
		//var costoTemp = costoFoglio/Math.max(dim,dim1);
		//tipoCarta= costoTemp<costoProdotto? carta[0]:tipoCarta;
		//costoProdotto= costoTemp<costoProdotto? costoTemp : costoProdotto;
	};
	return [tipoCarta,costoProdotto * qtaProdotti];
}

var cartaScelta = scegliCarta();
// ----------------------------------------------

// DIVISIONE CARTA IN BASE A COPIE SU STAMPANTE

function scegliCarta1 (){
	"use strict";
	var costoProdotto=1000; // Costo della carta nell'area occupata dal prodotto
	var tipoCarta="";
	for (var nomeCarta in carte) {
		var carta= carte[nomeCarta]; 
		var costoFoglio= carta.costoFoglio;
		var wFoglio= carta.width; // dimensioni della carta in cm
		var hFoglio= carta.height; // dimensioni della carta in cm
		for (var nomeStampante in stampanti) {
			var stampante= stampanti[nomeStampante];
			var wStampante = stampante.width;
			var hStampante = stampante.height;
			wStampa=21;
			hStampa=29.7;
			
			var copie=contaCopie(wStampante,hStampante,wStampa,hStampa);
			var maxCopie= Math.max(copie.WwHh,copie.WhHw); // Massimo numero di copie che possono uscire dal foglio
			var dimMinTagliato=[];
			if (copie.WwHh>=copie.WhHw){
				dimMinTagliato.w=copie.ww*wStampa;
				dimMinTagliato.h=copie.hh*hStampa;
			}else{
				dimMinTagliato.w=copie.wh*hStampa;
				dimMinTagliato.h=copie.hw*wStampa;
			}
			copie=contaCopie(wFoglio,hFoglio,dimMinTagliato.w,dimMinTagliato.h);
			var dimMaxTagliato=[];
			if (copie.WwHh>=copie.WhHw){
				dimMaxTagliato.w=wFoglio/copie.ww;
				dimMaxTagliato.h=hFoglio/copie.hh;
			}else{
				dimMaxTagliato.w=wFoglio/copie.wh;
				dimMaxTagliato.h=hFoglio/copie.hw;
			}
		}
	};
	return [tipoCarta,costoProdotto * qtaProdotti];
}

var cartaScelta = scegliCarta1();
//-----------------------------------------


costoTotale=costoCarta+costoLavorazioni+costoMateriali+costoStampa;
