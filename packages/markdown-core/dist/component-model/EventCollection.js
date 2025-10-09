export class EventCollection {
    events = [];
    add(e) {
        this.events.push(e);
        return { dispose: () => this.remove(e) };
    }
    remove(e) {
        this.events = this.events.filter(l => l !== e);
    }
    deliver(callback) {
        return callback(this);
    }
    select(selector) {
        return (...args) => {
            for (const ev of this.events) {
                const func = selector(ev);
                func?.bind(ev)(...args);
            }
        };
    }
}
/*

interface IMyEvent
{
    click(): void;
    focus(): void;
}

class MyTest implements IMyEvent
{
    public a = 5;

    public test()
    {
        console.log(this.a);
    }

    public click()
    {
        console.log(`My Test click ${this.a}`)
    }

    public focus()
    {
        console.log(`My Test focus ${this.a}`)
    }
}

class YouTest implements IMyEvent
{
    public a = 5;

    public test()
    {
        console.log(this.a);
    }

    public click()
    {
        console.log(`You Test click ${this.a}`)
    }

    public focus()
    {
        console.log(`You Test focus ${this.a}`)
    }
}

const ec = new EventCollection<IMyEvent>();
ec.add(new MyTest())
ec.add(new YouTest());

const trigger = ec.deliver(r => {

    return {
        click: r.select(f => f.click),
        focus: r.select(f => f.focus)
    }
})

trigger.click();
console.log("---------------")
trigger.focus()

*/
//# sourceMappingURL=EventCollection.js.map