import { CommandService } from "./command.service";
import { StreamService } from "./stream.service";

export class RouterOSService {
  private systemService: CommandService;
  private streamService: StreamService;

  constructor(private host: string) {
    this.systemService = new CommandService(host, "system");
    this.streamService = new StreamService(host, "stream", "tool");
  }

  public system = {
    command: (command: string, direct = false) =>
      this.systemService.get(command, direct)
  };

  public stream = {
    tool: (command: string, address: string, n?: number, direct = false) =>
      this.streamService.start({ command, address, n }, direct)
  };
}
