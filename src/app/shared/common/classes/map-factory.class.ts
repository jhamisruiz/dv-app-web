class ComponentFactory {
  factory: Map<string, unknown> = new Map();

  hasComponent(id: string): boolean {
    return this.factory.has(id);
  }

  getComponent(id: string): unknown {
    return this.factory.get(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delComponent(id: string): void {

  }

  addComponent(id: string, component: unknown): void {
    this.factory.set(id, component);
  }
}

export const MapFactory = new ComponentFactory();
