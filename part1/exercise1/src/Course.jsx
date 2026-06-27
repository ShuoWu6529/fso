const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercise}
    </p>
  )
}
const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => <Part key={part.id} part={part.name} exercise={part.exercises}/>)}
    </div>
  )
}

const Total = (props) => {
  return (
    <p>total of {props.parts.reduce((acc, curr) => acc + curr.exercises, 0)} exercises</p>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course