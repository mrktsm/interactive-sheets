import {
  Disposable,
  ICommandService,
  Plugin,
  UniverInstanceType,
} from "@univerjs/core";
import type { Dependency } from "@univerjs/core";
import { Inject, Injector } from "@univerjs/core";
import { ComponentManager, IMenuManagerService, MenuItemType } from "@univerjs/ui";
import { RibbonStartGroup } from "@univerjs/ui";
import { TbLayoutSidebarRight } from "react-icons/tb";

const AI_CHAT_COMMAND_ID = "ai-chat.toggle";
const AI_CHAT_TOOLBAR_PLUGIN_NAME = "ai-chat-toolbar-plugin";

/**
 * Command definition for toggling the AI Chat sidebar
 */
export const ToggleAIChatCommand = {
  id: AI_CHAT_COMMAND_ID,
  type: 1, // COMMAND type
  handler: () => {
    // Call the global toggle function exposed by UniverSheet component
    (window as any).toggleAIChat?.();
    return true;
  },
};

/**
 * Controller that manages the AI Chat button in Univer's toolbar
 *
 * This controller:
 * - Registers the toggle command with Univer's command service
 * - Adds the "AI Chat" button to the native toolbar
 * - Integrates with Univer's menu system
 */
export class AIChatToolbarController extends Disposable {
  constructor(
    @Inject(Injector) private readonly _injector: Injector,
    @ICommandService private readonly _commandService: ICommandService,
    @IMenuManagerService
    private readonly _menuManagerService: IMenuManagerService,
    @Inject(ComponentManager)
    private readonly _componentManager: ComponentManager
  ) {
    super();

    this._initCommands();
    this._registerIcon();
    this._initMenus();
  }

  private _registerIcon(): void {
    // Register the custom React icon component with Univer
    this._componentManager.register("TbLayoutSidebarRight", TbLayoutSidebarRight);
  }

  private _initCommands(): void {
    // Register the toggle command
    this._commandService.registerCommand(ToggleAIChatCommand);
  }

  private _initMenus(): void {
    // Add the AI Chat button to Univer's native toolbar (aligned to the right, no chevron)
    this._menuManagerService.mergeMenu({
      [RibbonStartGroup.OTHERS]: {
        [AI_CHAT_COMMAND_ID]: {
          order: 999999, // Very high order value to position at the far right
          menuItemFactory: () => ({
            id: AI_CHAT_COMMAND_ID,
            type: MenuItemType.BUTTON, // Simple button (no dropdown/chevron)
            tooltip: "Open AI Assistant (Cmd+K)",
            icon: "TbLayoutSidebarRight",
          }),
        },
      },
    });
  }
}

/**
 * Univer Plugin for AI Chat Toolbar Integration
 *
 * This is a true Univer plugin that extends the Plugin class and integrates
 * the AI Chat button into Univer's native toolbar using their plugin architecture.
 */
export class UniverAIChatToolbarPlugin extends Plugin {
  static override pluginName = AI_CHAT_TOOLBAR_PLUGIN_NAME;
  static override type = UniverInstanceType.UNIVER_SHEET;

  constructor(
    _config: undefined,
    @Inject(Injector) protected override _injector: Injector
  ) {
    super();
  }

  override onStarting(): void {
    // Add the controller as a dependency
    ([[AIChatToolbarController]] as Dependency[]).forEach((dep) =>
      this._injector.add(dep)
    );
  }

  override onReady(): void {
    // Instantiate the controller to activate it
    this._injector.get(AIChatToolbarController);
  }
}
