import { Component, OnDestroy } from '@angular/core';
import { OneInchApiService } from './services/1inch.api/1inch.api.service';
import { GnosisService } from './services/gnosis.service';
import { TokenPriceService } from './services/token-price.service';
import { TokenService } from './services/token.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorage } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { ITokenDescriptor } from './services/token.helper';

const tokenAmountInputValidator = [
  Validators.pattern('^[0-9.]*$'),
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  public title = '1inch';

  @LocalStorage('displaySlippageSettings', false)
  displaySlippageSettings;

  @LocalStorage('slippage', 0.1)
  slippage;

  @LocalStorage('fromTokenSymbol', 'ETH') fromTokenSymbol;
  @LocalStorage('toTokenSymbol', 'DAI') toTokenSymbol;
  @LocalStorage('fromAmount', 1) fromAmount;

  swapForm = new FormGroup({
    fromAmount: new FormControl('', tokenAmountInputValidator),
    toAmount: new FormControl('', tokenAmountInputValidator),
  });

  loading = false;

  sortedTokens: Observable<ITokenDescriptor[]>;

  constructor(
    private oneInchApiService: OneInchApiService,
    private gnosisService: GnosisService,
    private tokenPriceService: TokenPriceService,
    public tokenService: TokenService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {

    iconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/settings.svg'));
    iconRegistry.addSvgIcon('swap', sanitizer.bypassSecurityTrustResourceUrl('assets/swap.svg'));

    // this.gnosisService.addListeners();
    // this.gnosisService.isMainNet$.subscribe(console.log);
    // this.gnosisService.walletAddress$.subscribe(console.log);

    this.tokenService.setTokenData('0x66666600E43c6d9e1a249D29d58639DEdFcD9adE');
    this.sortedTokens = this.tokenService.getSortedTokens();
    //this.tokenService.getSortedTokens().subscribe(console.log)


    // this.tokenService.tokenHelper$.pipe(
    //   tap((tokenHelper) => {
    //
    //   })
    // ).subscribe();
    // this.tokenPriceService.getTokenPriceBN('0x0000000000000000000000000000000000000000', 18).subscribe(console.log);

    // oneInchApiService.getQuote$('ETH', 'DAI', '10000000000000').subscribe(console.log);
    // oneInchApiService.getSwapData$(
    //   'ETH',
    //   'DAI',
    //   String(1e12),
    //   '0x66666600E43c6d9e1a249D29d58639DEdFcD9adE'
    //   // '1',
    //   // false
    // ).subscribe((x) => {
    //   console.log(x);
    //   // gnosisService.sendTransaction({
    //   //   to: x.to,
    //   //   data: x.data,
    //   //   value: x.value
    //   // });
    // });
  }

  ngOnDestroy() {
    this.gnosisService.removeListeners();
  }

  toggleSlippage() {
    this.displaySlippageSettings = !this.displaySlippageSettings;
  }

  swapTokenPlaces() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }

  getTokenLogoImage(tokenAddress: string): string {
    return `https://1inch.exchange/assets/tokens/${tokenAddress.toLowerCase()}.png`;
  }
}
