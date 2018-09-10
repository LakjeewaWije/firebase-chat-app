import { SampleChatModule } from './sample-chat.module';

describe('SampleChatModule', () => {
  let sampleChatModule: SampleChatModule;

  beforeEach(() => {
    sampleChatModule = new SampleChatModule();
  });

  it('should create an instance', () => {
    expect(sampleChatModule).toBeTruthy();
  });
});
