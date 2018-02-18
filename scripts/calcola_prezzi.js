// JavaScript Document

var costoTotale=0;
var costoCarta=0;
var costoStampa=0;
var costoMateriali=0;
var costoLavorazioni=0; // Costo altre lavorazioni
var hStampa=20; // Altezza della stampa in cm (compresi bordi)
var wStampa=10; // Larghezza della stampa in cm (compresi bordi)
//var areaStampa=hStampa*wStampa/10000; // Area della stampa in m2 (compresi bordi)
var costoOrario=15; // Costo in euro per un ora di lavoro di un lavoratore
var qtaProdotti=100; // Quantità di prodotti finali
var carteDisponibili=[["patLuc_64x88",64,88,0.08]];
//var carteDisponibili=[["patLuc_70x100",70,100,0.09],["patLuc_64x88",64,88,0.08]]; // Dimensioni di carta disponibili [larghezza,altezza,costoFoglio]
var coloriStampa=2; // Qta di colori che verranno stampati


function carta (type, grammatura, width, height, costoFoglio){
	this.type=type;
	this.grammatura=grammatura;
	this.width=width;
	this.height=height;
	this.costoFoglio=costoFoglio;
}
var carte = [];
carte["patLucida_64x88_170"]=new carta("patLucida",170,64,88,0.005); 

// ---------- Calcolo Costo Stampa ------------
function stampante (width, height, colors){
	this.width=width;
	this.height=height;
	this.colors=colors;
}
var stampanti=[];
stampanti["gto"]=new stampante(32,46,1);
//var stampanti=[["gto",32,46,1],["gto2",36,52,2],["grande",50,70,1]];

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
		
		alert (nomeCarta + " su " + nomeStampante + " = " + dimWwHh[0] + "-" + dimWwHh[1]);
	};
	
};


// --------------------------------------------


// ---------- Calcolo Costo Carta ------------

// Calcola di quanti fogli ho bisogno
function scegliCarta (){
	"use strict";
	var costoProdotto=1000; // Costo della carta nell'area occupata dal prodotto
	var tipoCarta="";
	carteDisponibili.forEach(function(carta, index){ 
		var costoFoglio= carta[3];
		var hFoglio= carta[1]; // dimensioni della carta in cm
		var wFoglio= carta[2]; // dimensioni della carta in cm
		var dim=0; var dim1=0;
		if (hFoglio>= hStampa && wFoglio>=wStampa){
			dim =Math.floor(hFoglio / hStampa) * Math.floor(wFoglio / wStampa);
		}
		if (hFoglio>= wStampa && wFoglio>=hStampa){
			dim1 =Math.floor(hFoglio / wStampa) * Math.floor(wFoglio / hStampa);
		}
		var costoTemp = costoFoglio/Math.max(dim,dim1);
		tipoCarta= costoTemp<costoProdotto? carta[0]:tipoCarta;
		costoProdotto= costoTemp<costoProdotto? costoTemp : costoProdotto;
	});
	return [tipoCarta,costoProdotto * qtaProdotti];
}

var cartaScelta = scegliCarta();
//--------------------------------------------




costoTotale=costoCarta+costoLavorazioni+costoMateriali+costoStampa;
