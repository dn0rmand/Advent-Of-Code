import pyglet

def loadData():
    stars = []
    img = pyglet.image.load("2018/data/star.png")

    for line in open('2018/data/day10.data', 'rt'):
        x = int(line[10:16]) - 160
        y = int(line[18:24]) - 110
        vx= int(line[36:38])
        vy= int(line[40:42])

        star = pyglet.sprite.Sprite(img)
        star.x = x * 16
        star.y = 768 - (y * 16)
        star.xx = x
        star.yy = y
        star.vx = vx
        star.vy = vy
        stars.append(star)
    return stars

window = pyglet.window.Window(1100, 768)
stars = loadData()

def update(dt):
    maxY = -99999
    minY =  99999

    for star in stars:
        star.xx += star.vx * dt
        star.yy += star.vy * dt
        star.x = star.xx * 16
        star.y = 768 - (star.yy * 16)
        minY = min(star.yy, minY)
        maxY = max(star.yy, maxY)

    if maxY-minY <= 10:
        return True
    else:
        return False
    
def doUpdate(dt):
    if update(1):
        pyglet.clock.unschedule(doUpdate)

@window.event
def on_draw():
    window.clear()
    for star in stars:
        star.draw()

update(10100)
pyglet.clock.schedule_interval(doUpdate, 1/50.0)
pyglet.app.run()