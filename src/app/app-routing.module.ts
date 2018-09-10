import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 import { ChatComponent } from './chat/chat/chat.component';
import { SampleChatComponent} from './sample-chat/sample-chat/sample-chat.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/sample', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
  { path: 'sample', component: SampleChatComponent}
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
